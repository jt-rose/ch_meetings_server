import { Authenticated } from 'src/middleware/authChecker'
import { CustomError } from 'src/middleware/errorHandler'
import { Context } from 'src/utils/context'
import {
  Resolver,
  FieldResolver,
  Ctx,
  Root,
  Mutation,
  Arg,
  Int,
} from 'type-graphql'
import { ValidatedWorkshopUnion, Workshop } from './Workshop'
import { REGION } from '../enums/REGION'
import { TIME_ZONE } from '../enums/TIME_ZONES'
import { WORKSHOP_STATUS } from '../enums/WORKSHOP_STATUS'
import { Manager } from '../managers/Manager'
import { WorkshopSession } from './Session'
import { WorkshopChangeRequest } from './WorkshopChangeRequest'
import { CreateSessionInput } from './workshop_utils/SessionInput'
import { validateWorkshopRequest } from './workshop_utils/validateWorkshopRequest'
import { EditWorkshopInput } from './workshop_utils/workshopInput'
import { TimeConflictError } from './workshop_utils/checkTimeConflicts'

// ! remove commented out workshop status === cancelled on validate function
// ! validate before restoring
// ! currently cannot edit client or course -> may add course editing later

/* --------------------------- resolver functions --------------------------- */

@Resolver(WorkshopChangeRequest)
export class WorkshopChangeRequestResolver {
  /* ----------------------------- field resolvers ---------------------------- */

  @FieldResolver(() => [WorkshopSession])
  change_request_sessions(
    @Ctx() ctx: Context,
    @Root() workshopChangeRequest: WorkshopChangeRequest
  ) {
    return ctx.prisma.workshop_change_requests
      .findUnique({
        where: {
          workshop_change_request_id:
            workshopChangeRequest.workshop_change_request_id,
        },
      })
      .workshop_sessions()
  }

  @FieldResolver(() => Manager)
  requestor(
    @Ctx() ctx: Context,
    @Root() workshopChangeRequest: WorkshopChangeRequest
  ) {
    return ctx.prisma.workshop_change_requests
      .findUnique({
        where: {
          workshop_change_request_id:
            workshopChangeRequest.workshop_change_request_id,
        },
      })
      .managers()
  }

  /* ----------------------------- CRUD operations ---------------------------- */

  // Read operations will be run as field resolvers on the workshop and sessions queries
  // so no direct read queries for change requests are needed

  // session change requests will be managed as a subquery with the workshop change request mutations

  // create change request - manager

  @Authenticated()
  @Mutation(() => ValidatedWorkshopUnion)
  async upsertChangeRequest(
    @Ctx() ctx: Context,
    @Arg('workshop_id', () => Int) workshop_id: number,
    @Arg('workshopInput', () => EditWorkshopInput)
    workshopInput: EditWorkshopInput,
    @Arg('editedSessions', () => [CreateSessionInput])
    editedSessions: CreateSessionInput[],
    @Arg('change_request_note') change_request_note: string
  ) {
    // when requesting a change to workshop/ sessions, new workshop/ sessions will be supplied
    // if accepted, the original workshop entity will be updated
    // (to maintain the PK, change logs, unique cohort name, and nanoid)
    // but the old sessions will be marked inactive and replaced with the newly requested sessions
    // this will simplify the process
    // (as opposed to mutating, adding, removing old sessions, which can quickly become complicated)

    // on the front end, will need to diff workshop and session to show updates

    // destructure user role
    const { manager_id, role } = ctx.req.session
    // check for current change request
    const workshop = await ctx.prisma.workshops.findFirst({
      where: { workshop_id },
      include: { manager_assignments: true, workshop_change_requests: true },
    })

    /* ---------------------------- validate request ---------------------------- */
    if (!workshop) {
      throw new CustomError('No such workshop found!')
    }

    const currentChangeRequest = workshop.workshop_change_requests[0]
      ? workshop.workshop_change_requests[0]
      : undefined
    // confirm member of client team if not coordinator, admin, or superadmin
    if (
      role === 'USER' &&
      workshop.manager_assignments.every(
        (assignment) => assignment.manager_id !== manager_id
      )
    ) {
      throw new CustomError(
        'Only a member of this client team may request changes!'
      )
    }

    // validate new change request
    const validationResult = await validateWorkshopRequest({
      workshopDetails: workshopInput,
      sessionDetails: editedSessions,
      client_id: workshop.client_id,
      course_id: workshop.course_id,
      prisma: ctx.prisma,
    })

    if (validationResult instanceof TimeConflictError) {
      return validationResult
    }

    /* --------------- if no change request found, create new one --------------- */
    if (!currentChangeRequest) {
      // batch queries to create change reuest and update change_request boolean on workshop object
      const createChangeRequest = ctx.prisma.workshop_change_requests.create({
        data: {
          ...workshopInput,
          client_id: workshop.client_id,
          course_id: workshop.course_id,
          change_request_note,
          coordinator_request: ctx.req.session.role === 'COORDINATOR',
          deleted: workshopInput.workshop_status === 'CANCELLED',
          requested_by: ctx.req.session.manager_id!,
          requested_at: new Date(),
          workshop_id,
          workshop_sessions: {
            createMany: {
              data: editedSessions.map((session) => ({
                ...session,
                workshop_id,
                created_by: ctx.req.session.manager_id!,
                created_at: new Date(),
              })),
            },
          },
        },
      })

      const updateWorkshopRequest = ctx.prisma.workshops.update({
        where: { workshop_id },
        data: {
          active_change_request: true,
          workshop_change_log: {
            create: {
              note: `Change Request Submitted`,
              created_by: ctx.req.session.manager_id,
              created_at: new Date(),
            },
          },
        },
      })

      // run batched queries in transaction
      const result = await ctx.prisma.$transaction([
        createChangeRequest,
        updateWorkshopRequest,
      ])

      // return change request object
      return result[0]
    }

    /* ------------------- if change request exists, update it ------------------ */
    // this can be used for updating your own request or proposing different changes from what another team member had requested

    // update change request
    const removeCurrentChangeRequestSessions =
      ctx.prisma.workshop_sessions.deleteMany({
        where: {
          workshop_change_request_id:
            currentChangeRequest.workshop_change_request_id,
        },
      })
    const removeCurrentWorkshopChangeRequest =
      ctx.prisma.workshop_change_requests.delete({
        where: {
          workshop_change_request_id:
            currentChangeRequest.workshop_change_request_id,
        },
      })
    const createNewChangeRequest = ctx.prisma.workshop_change_requests.create({
      data: {
        ...workshopInput,
        course_id: workshop.course_id,
        client_id: workshop.client_id,
        change_request_note,
        coordinator_request: ctx.req.session.role === 'COORDINATOR',
        deleted: workshopInput.workshop_status === 'CANCELLED',
        requested_by: ctx.req.session.manager_id!,
        requested_at: new Date(),
        workshop_id,
        workshop_sessions: {
          createMany: {
            data: editedSessions.map((session) => ({
              ...session,
              workshop_id,
              created_by: ctx.req.session.manager_id!,
              created_at: new Date(),
            })),
          },
        },
      },
    })
    // run transaction
    const result = await ctx.prisma.$transaction([
      removeCurrentChangeRequestSessions,
      removeCurrentWorkshopChangeRequest,
      createNewChangeRequest,
    ])

    // return new change request from transaction
    return result[2]
  }

  // approve requested changes and apply them
  @Authenticated()
  @Mutation(() => ValidatedWorkshopUnion)
  async approveRequestedChanges(
    @Ctx() ctx: Context,
    @Arg('workshop_change_request_id', () => Int)
    workshop_change_request_id: number
  ) {
    // get change request
    const changeRequest = await ctx.prisma.workshop_change_requests.findFirst({
      where: { workshop_change_request_id },
      include: {
        workshop_sessions: true,
        workshops: true,
        clients: {
          include: {
            available_licenses: { include: { reserved_licenses: true } },
          },
        },
      },
    })

    if (!changeRequest) {
      throw new CustomError('No such change request found!')
    }

    // confirm valid user roles
    // require coordinator requests to be approved by management / admins
    if (
      changeRequest.coordinator_request &&
      ctx.req.session.role === 'COORDINATOR'
    ) {
      throw new CustomError(
        'This request came from a coordinator and must be approved by the management team or an admin'
      )
    }

    // require management requests to be approved by coordinators / admins
    if (!changeRequest.coordinator_request && ctx.req.session.role === 'USER') {
      throw new CustomError(
        'This request came from the management team and must be approved by a coordinator or an admin'
      )
    }
    // check if the course and class sizes will change and manage license amounts if so
    const classSizeChange =
      changeRequest.class_size - changeRequest.workshops.class_size
    const courseChange =
      changeRequest.course_id === changeRequest.workshops.course_id

    // validate change request
    const validationResult = await validateWorkshopRequest({
      workshopDetails: {
        ...changeRequest,
        workshop_status: WORKSHOP_STATUS[changeRequest.workshop_status],
        workshop_region: REGION[changeRequest.workshop_region],
        time_zone: changeRequest.time_zone as TIME_ZONE, //TIME_ZONE[changeRequest.time_zone],
      },
      sessionDetails: changeRequest.workshop_sessions,
      client_id: changeRequest.client_id,
      course_id: changeRequest.course_id,
      prisma: ctx.prisma,
    })

    if (validationResult instanceof TimeConflictError) {
      return validationResult
    }

    const replacementSessionsSortedByDate = changeRequest.workshop_sessions
      .map((x) => x.start_time)
      .sort()
    const startOfFinalSession =
      replacementSessionsSortedByDate[
        replacementSessionsSortedByDate.length - 1
      ]
    // accept and apply
    const deletePreviousSessions = ctx.prisma.workshop_sessions.deleteMany({
      where: {
        workshop_id: changeRequest.workshop_id,
        workshop_change_request_id: { not: workshop_change_request_id },
      },
    })
    const updateReplacementSessions = ctx.prisma.workshop_sessions.updateMany({
      where: { workshop_change_request_id },
      data: { workshop_change_request_id: null },
    })
    const updateWorkshopRequest = ctx.prisma.workshops.update({
      where: { workshop_id: changeRequest.workshop_id },
      data: {
        active_change_request: false,
        workshop_start_time: replacementSessionsSortedByDate[0],
        workshop_end_time: startOfFinalSession,
        // change course id? client?
        cohort_name: changeRequest.cohort_name,
        requested_advisor_id: changeRequest.requested_advisor_id,
        assigned_advisor_id: changeRequest.assigned_advisor_id,
        workshop_location: changeRequest.workshop_location,
        workshop_region: changeRequest.workshop_region,
        class_size: changeRequest.class_size,
        open_air_id: changeRequest.open_air_id,
        time_zone: changeRequest.time_zone,
        workshop_language: changeRequest.workshop_language,
        record_attendance: changeRequest.record_attendance,
        in_person: changeRequest.in_person,
        deleted: changeRequest.deleted,
        workshop_status: changeRequest.workshop_status,
        workshop_change_requests: { delete: { workshop_change_request_id } },
        workshop_change_log: {
          create: {
            note: 'Change request approved and workshop details updated',
            created_at: new Date(),
            created_by: ctx.req.session.manager_id,
          },
        },
      },
    })

    // confirm available and reserved licenses
    // calculate change based on diffing new class_size and old class_size
    // get available and reserved licenses, while distinguishing for course changes
    const availableLicenses = await ctx.prisma.available_licenses.findMany({
      where: {
        client_id: changeRequest.client_id,
        course_id: {
          in: [changeRequest.course_id, changeRequest.workshops.course_id],
        },
      },
      include: {
        reserved_licenses: {
          where: { workshop_id: changeRequest.workshop_id },
        },
      },
    })
    const workshopRequestAvailableLicense = availableLicenses.find(
      (license) => license.course_id === changeRequest.workshops.course_id
    )
    const changeRequestAvailableLicense = courseChange
      ? availableLicenses.find(
          (license) => license.course_id === changeRequest.course_id
        )
      : workshopRequestAvailableLicense

    // update available and reserved licenses:
    //      a. no course change -> update directly
    //      b. course change -> delete old reservation and give available licenses back, adjust available / reserved for new course
    const createLicenseUpdates = () => {
      if (courseChange || classSizeChange !== 0) {
        // confirm licenses are available for requested course(s)
        if (!workshopRequestAvailableLicense) {
          throw new CustomError(
            `This client has no licenses for course ${changeRequest.workshops.course_id} found!`
          )
        }

        if (!changeRequestAvailableLicense) {
          throw new CustomError(
            `This client has no licenses for course ${changeRequest.course_id} found!`
          )
        }
        // the original workshop request should always have a reserved license
        // with an amount above 0 to pair with the available license
        // if not found, throw a normal error that will be hidden from the user but stored in the error log
        const originalRemainingAmount =
          workshopRequestAvailableLicense.remaining_amount
        const originalReservedLicense =
          workshopRequestAvailableLicense.reserved_licenses.find(
            (license) =>
              license.license_id === workshopRequestAvailableLicense.license_id
          )
        if (!originalReservedLicense) {
          throw new Error(
            `No reserved licenses found to match workshop #${changeRequest.workshop_id}`
          )
        }
        const originalReservedAmount = originalReservedLicense.reserved_amount
        // reject if not enough licenses are available
        if (changeRequestAvailableLicense.remaining_amount < classSizeChange) {
          throw new CustomError('Not enough licenses available for the class!')
        }
        // adjust available and reserved licenses , while checking for course changes
        if (courseChange) {
          // remove reserved licenses from old course and restore available licenses to that course
          const restoreOldCourseLicenses = ctx.prisma.available_licenses.update(
            {
              where: { license_id: workshopRequestAvailableLicense.license_id },
              data: {
                license_changes: {
                  create: {
                    amount_change: originalReservedAmount,
                    reserved_license_id:
                      originalReservedLicense.reserved_license_id,
                    updated_amount:
                      originalRemainingAmount + originalReservedAmount,
                    change_note: `A change request to switch the workshop from this course to another was accepted - ${originalReservedAmount} have been restored and the reserved license #${originalReservedLicense.reserved_license_id} has been cancelled`,
                    created_by: ctx.req.session.manager_id!,
                    created_at: new Date(),
                  },
                },
                remaining_amount:
                  originalRemainingAmount + originalReservedAmount,
                reserved_licenses: {
                  update: {
                    where: {
                      reserved_license_id:
                        originalReservedLicense.reserved_license_id,
                    },
                    data: {
                      reserved_status: 'CANCELLED',
                      last_updated: new Date(),
                    },
                  },
                },
              },
            }
          )
          //adjust available licenses for new course and create license reservation for new course
          const reserveNewLicenses = ctx.prisma.available_licenses.update({
            where: { license_id: changeRequestAvailableLicense.license_id },
            data: {
              license_changes: {
                create: {
                  amount_change: changeRequest.class_size,
                  updated_amount:
                    changeRequestAvailableLicense.remaining_amount -
                    changeRequest.class_size,
                  change_note: `A change request to switch the workshop from course #${workshopRequestAvailableLicense.course_id} to this course was accepted - ${changeRequest.class_size} have been reserved from this license and the reserved license #${originalReservedLicense.reserved_license_id} for the previous course has been cancelled`,
                  created_by: ctx.req.session.manager_id!,
                  created_at: new Date(),
                },
              },
              // since the licenses will be taken out of an entirely new course, we can't use the "classSizeChange"
              // variable and instead need to remove the full amount
              remaining_amount:
                changeRequestAvailableLicense.remaining_amount -
                changeRequest.class_size,
              reserved_licenses: {
                create: {
                  created_by: ctx.req.session.manager_id!,
                  created_at: new Date(),
                  last_updated: new Date(),
                  reserved_amount: changeRequest.class_size,
                  reserved_status: 'RESERVED',
                  workshop_id: changeRequest.workshop_id,
                },
              },
            },
          })

          return [restoreOldCourseLicenses, reserveNewLicenses]
        } else {
          // adjust available license amount and reserved license amount
          const adjustLicenseReservations =
            ctx.prisma.available_licenses.update({
              where: { license_id: changeRequestAvailableLicense.license_id },
              data: {
                license_changes: {
                  create: {
                    amount_change: classSizeChange,
                    reserved_license_id:
                      originalReservedLicense.reserved_license_id,
                    updated_amount:
                      workshopRequestAvailableLicense.remaining_amount -
                      classSizeChange,
                    change_note: `class size changed from ${originalReservedAmount} to ${
                      changeRequest.class_size
                    }, requiring ${
                      classSizeChange > 0 && '+'
                    } ${classSizeChange}`,
                    created_by: ctx.req.session.manager_id!,
                    created_at: new Date(),
                  },
                },
                remaining_amount:
                  workshopRequestAvailableLicense.remaining_amount -
                  classSizeChange,
                reserved_licenses: {
                  update: {
                    where: {
                      reserved_license_id:
                        originalReservedLicense.reserved_license_id,
                    },
                    data: {
                      reserved_amount: changeRequest.class_size,
                      last_updated: new Date(),
                    },
                  },
                },
              },
            })

          return [adjustLicenseReservations]
        }
        // return empty array when no license change needed
      } else return []
    }

    // generate license updates
    const updateLicenses = createLicenseUpdates()

    // run all updates in a transaction
    const result = await ctx.prisma.$transaction([
      deletePreviousSessions,
      updateReplacementSessions,
      updateWorkshopRequest,
      ...updateLicenses,
    ])

    // return updated workshop object
    return result[2]
  }

  // changes can be rejected from either side (ie, the person requesting changes or the one reviewing them)
  @Authenticated()
  @Mutation(() => Workshop)
  async rejectRequestedChanges(
    @Ctx() ctx: Context,
    @Arg('workshop_change_request_id', () => Int)
    workshop_change_request_id: number
  ) {
    // confirm team member if manager
    // get change request
    const changeRequest = await ctx.prisma.workshop_change_requests.findFirst({
      where: { workshop_change_request_id },
      include: { workshops: { include: { manager_assignments: true } } },
    })
    if (!changeRequest) {
      throw new CustomError('No such change request found!')
    }

    if (
      ctx.req.session.role === 'USER' &&
      changeRequest.workshops.manager_assignments.every(
        (assignment) => assignment.manager_id !== ctx.req.session.manager_id
      )
    ) {
      throw new CustomError(
        'You must be an assigned manager of this workshop to reject change requests!'
      )
    }

    // delete change request and associated sessions
    return ctx.prisma.workshops.update({
      where: { workshop_id: changeRequest.workshop_id },
      data: {
        active_change_request: false,
        workshop_change_requests: { delete: { workshop_change_request_id } },
        workshop_sessions: { deleteMany: { workshop_change_request_id } },
      },
    })
  }
}
