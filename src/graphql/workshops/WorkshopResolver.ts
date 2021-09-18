import {
  Resolver,
  FieldResolver,
  Query,
  Arg,
  Int,
  Ctx,
  Root,
  Mutation,
  createUnionType,
} from 'type-graphql'
import { Workshop } from './Workshop'
import { WorkshopSession } from './Session'
import { WorkshopNote } from './WorkshopNote'
import { ChangeLog } from './WorkshopChangeLog'
import { Manager } from '../managers/Manager'
import { Context } from '../../utils/context'
import { Course } from '../courses/Course'
import { Coursework } from '../courses/Coursework'
import { Client } from '../clients/Client'
import { Advisor } from '../advisors/Advisor'
import {
  Authenticated,
  CoordinatorOrAdminOnly,
} from '../../middleware/authChecker'

import {
  WorkshopsOrderBy,
  parseWorkshopOrderByArgs,
  WorkshopFilterOptions,
  parseWorkshopWhereArgs,
} from './workshop_utils/WorkshopSearch'
import {
  CreateWorkshopInput,
  EditWorkshopInput,
} from './workshop_utils/workshopInput'
import { CreateSessionInput } from './workshop_utils/SessionInput'
import { SCHEDULING_PROCESS, WORKSHOP_STATUS } from '../enums/WORKSHOP_STATUS'
import { nanoid } from 'nanoid'
import { TimeConflictError } from './workshop_utils/checkTimeConflicts'
import { CustomError } from '../../middleware/errorHandler'
import { validateWorkshopRequest } from './workshop_utils/validateWorkshopRequest'

// generate success / error union type when creating/ editing workshop
const CreateWorkshopResultUnion = createUnionType({
  name: 'CreateWorkshopResult',
  types: () => [Workshop, TimeConflictError] as const,
  resolveType: (value) => {
    if ('timeConflicts' in value) {
      return TimeConflictError
    }
    if ('workshop_id' in value) {
      return Workshop
    }
    return undefined
  },
})
// ! add managers/ edit
@Resolver(Workshop)
export class WorkshopResolver {
  /* ----------------------------- field resolvers ---------------------------- */

  // assigned advisor
  @FieldResolver(() => [Advisor], { nullable: true })
  assignedAdvisor(@Ctx() ctx: Context, @Root() root: Workshop) {
    return ctx.prisma.workshops
      .findUnique({ where: { workshop_id: root.workshop_id } })
      .advisors_advisorsToworkshops_assigned_advisor_id()
  }

  // requested advisor
  @FieldResolver(() => [Advisor], { nullable: true })
  requestedAdvisor(@Ctx() ctx: Context, @Root() root: Workshop) {
    return ctx.prisma.workshops
      .findUnique({ where: { workshop_id: root.workshop_id } })
      .advisors_advisorsToworkshops_requested_advisor_id()
  }

  // client
  @FieldResolver(() => [Client])
  client(@Ctx() ctx: Context, @Root() root: Workshop) {
    return ctx.prisma.workshops
      .findUnique({ where: { workshop_id: root.workshop_id } })
      .clients()
  }

  // course
  @FieldResolver(() => [Course])
  course(@Ctx() ctx: Context, @Root() root: Workshop) {
    return ctx.prisma.workshops
      .findUnique({ where: { workshop_id: root.workshop_id } })
      .courses()
  }

  // coursework
  @FieldResolver(() => [Coursework])
  coursework(@Ctx() ctx: Context, @Root() root: Workshop) {
    return ctx.prisma.workshops
      .findUnique({ where: { workshop_id: root.workshop_id } })
      .workshop_coursework({ include: { coursework: true } })
  }

  // sessions
  @FieldResolver(() => [WorkshopSession])
  sessions(@Ctx() ctx: Context, @Root() root: Workshop) {
    return ctx.prisma.workshops
      .findUnique({ where: { workshop_id: root.workshop_id } })
      .workshop_sessions()
  }

  // workshop_notes
  @FieldResolver(() => [WorkshopNote])
  notes(@Ctx() ctx: Context, @Root() root: Workshop) {
    return ctx.prisma.workshops
      .findUnique({ where: { workshop_id: root.workshop_id } })
      .workshop_notes()
  }

  // change_log
  @FieldResolver(() => [ChangeLog])
  changeLog(@Ctx() ctx: Context, @Root() root: Workshop) {
    return ctx.prisma.workshops
      .findUnique({ where: { workshop_id: root.workshop_id } })
      .workshop_change_log()
  }

  // managers
  @FieldResolver(() => [Manager])
  managers(@Ctx() ctx: Context, @Root() root: Workshop) {
    return ctx.prisma.workshops
      .findUnique({ where: { workshop_id: root.workshop_id } })
      .manager_assignments({ include: { managers: true } })
  }

  // workshop groups
  //@FieldResolver(() => )
  //workshop_groups() {}
  /* ------------------------------ workshop CRUD ----------------------------- */

  // get workshop (field resolvers on sessions + dataloader)
  @Authenticated()
  @Query(() => Workshop)
  getWorkshop(
    @Ctx() ctx: Context,
    @Arg('workshop_id', () => Int) workshop_id: number
  ) {
    return ctx.prisma.workshops.findFirst({ where: { workshop_id } })
  }

  // getAllWorkshops
  // uses input object for filtering, sorting, and pagination
  @Authenticated()
  @Query(() => [Workshop])
  getAllWorkshops(
    @Ctx() ctx: Context,
    @Arg('orderBy', () => [WorkshopsOrderBy], { nullable: true })
    orderBy?: WorkshopsOrderBy[],
    @Arg('filters', () => WorkshopFilterOptions, { nullable: true })
    filters?: WorkshopFilterOptions,
    @Arg('take', { nullable: true }) take?: number,
    @Arg('skip', { nullable: true }) skip?: number
  ) {
    // add real limit plus more property
    const formattedOrderByArgs = orderBy
      ? orderBy.map(parseWorkshopOrderByArgs)
      : []
    const formattedWhereFilters = filters ? parseWorkshopWhereArgs(filters) : {}
    return ctx.prisma.workshops.findMany({
      where: formattedWhereFilters,
      orderBy: formattedOrderByArgs,
      skip: skip || 0,
      take: take || 25,
    })
  }

  // optimized queries - build later
  // getWorkshopWithFields
  // getAllWorkshopsWithFields

  // create workshop (generate sessions at same time)
  @Authenticated()
  @Mutation(() => CreateWorkshopResultUnion)
  async addWorkshop(
    @Ctx() ctx: Context,
    @Arg('workshopDetails', () => CreateWorkshopInput)
    workshopDetails: CreateWorkshopInput,
    @Arg('sessionDetails', () => [CreateSessionInput])
    sessionDetails: CreateSessionInput[],
    @Arg('managers', () => [Int]) managers: number[],
    @Arg('notes', () => [String], { nullable: true }) notes: string[]
  ) {
    /* ----- validate workshop request and return info on available licenses ---- */
    const validationResult = await validateWorkshopRequest({
      workshopDetails,
      sessionDetails,
      client_id: workshopDetails.client_id,
      prisma: ctx.prisma,
    })
    if (validationResult instanceof TimeConflictError) {
      return validationResult
    }
    if (validationResult === 'CANCELLED - NO VALIDATION NEEDED') {
      throw Error(
        'workshop status of cancelled being applied during "addWorkshop" resolver function'
      )
    }
    const { clientWithLicenses, updatedAvailableLicenseAmount } =
      validationResult

    /* -------------- format sub fields and create workshop request ------------- */
    // format sessions objects
    const sessions = sessionDetails.map((session) => ({
      ...session,
      created_by: ctx.req.session.manager_id!,
    }))

    // format workshop notes
    const workshop_notes = notes.map((note) => ({
      note,
      created_by: ctx.req.session.manager_id!,
      created_at: new Date(),
    }))

    // format managers of workshop
    const managerAssignments = managers.map((manager_id) => ({
      manager_id,
      active: true,
    }))

    // format create workshop and edit available licenses queries
    // which will be run in a transaction
    const license_id = clientWithLicenses.available_licenses[0].license_id

    const createWorkshop = ctx.prisma.workshops.create({
      data: {
        ...workshopDetails,
        created_by: ctx.req.session.manager_id!,
        workshop_status: WORKSHOP_STATUS.REQUESTED,
        deleted: false,
        participant_sign_up_link: nanoid(),
        // password for sign_up_link?
        launch_participant_sign_ups: false,
        active_change_request: false,
        workshop_sessions: { createMany: { data: sessions } },
        manager_assignments: { createMany: { data: managerAssignments } },
        workshop_notes: { createMany: { data: workshop_notes } },
        workshop_change_log: {
          create: {
            created_by: ctx.req.session.manager_id!,
            created_at: new Date(),
            note: 'workshop request created',
          },
        },
        // reserved license changes will be run in a nested create
        // to capture the generated workshop id
        reserved_licenses: {
          create: {
            created_by: ctx.req.session.manager_id!,
            created_at: new Date(),
            last_updated: new Date(),
            reserved_amount: workshopDetails.class_size,
            reserved_status: 'RESERVED',
            license_id,
          },
        },
        license_changes: {
          create: {
            created_by: ctx.req.session.manager_id!,
            created_at: new Date(),
            amount_change: -workshopDetails.class_size,
            updated_amount: updatedAvailableLicenseAmount,
            change_note: `${workshopDetails.class_size} licenses reserved for workshop`,
            license_id,
          },
        },
      },
    })

    const createLicenseChanges = ctx.prisma.available_licenses.update({
      where: { license_id },
      data: {
        remaining_amount: updatedAvailableLicenseAmount,
        last_updated: new Date(),
      },
    })

    // run transaction creating workshop and updating available and reserved licenses
    const result = await ctx.prisma.$transaction([
      createWorkshop,
      createLicenseChanges,
    ])

    // return created workshop
    return result[0]
  }

  // ! deleteNewRequest() {} -> simplify logic of edit and break apart, use function for validation and call in each

  // edit a newly requested workshop that has not begun the scheduling process yet
  //// or edit directly as an admin
  // once the scheduling process (Scheduling status -> Vetting / Holding, Assigned, etc) has begun
  // changes will need to be requested and only applied after approved
  // these will be handled by the WorkshopChangeRequest resolver
  // clients and courses cannot be changed here, and will instead need to cancel the request
  // and submit a new one, which is done to simplify tracking
  // on the front end, this will be simplified using redux,
  // allowing users to request a new workshop with the saved parameters but different clients/ courses
  @Authenticated()
  @Mutation(() => CreateWorkshopResultUnion)
  async editUnprocessedWorkshop(
    @Ctx() ctx: Context,
    @Arg('workshop_id', () => Int) workshop_id: number,
    @Arg('workshopDetails', () => EditWorkshopInput)
    workshopDetails: EditWorkshopInput,
    @Arg('sessionDetails', () => [CreateSessionInput])
    sessionDetails: CreateSessionInput[],
    @Arg('managers', () => [Int]) managers: number[],
    @Arg('deleted') deleted: boolean,
    @Arg('note', () => String, { nullable: true }) note?: string
  ) {
    // ! what about client / course change?
    // confirm requested workshop has not entered the scheduling process yet
    const workshopRequest = await ctx.prisma.workshops.findFirst({
      where: { workshop_id },
      include: {
        manager_assignments: true,
        reserved_licenses: {
          where: { workshop_id },
          include: { available_licenses: true },
        },
      },
    })

    if (!workshopRequest) {
      throw new CustomError('No such workshop found!')
    }
    if (workshopRequest.workshop_status !== 'REQUESTED') {
      throw new CustomError(
        'A workshop that is no longer in "REQUESTED" status can only be changed by submitting a change request'
      )
    }
    const reservedLicenses = workshopRequest.reserved_licenses[0]
    const { reserved_license_id, available_licenses } = reservedLicenses

    // confirm the user is from the same BU that originated the request
    const assignedManager = workshopRequest.manager_assignments.find(
      (assignment) => assignment.manager_id === ctx.req.session.manager_id
    )
    if (!assignedManager) {
      throw new CustomError(
        'Only a team member of this project can update the request!'
      )
    }

    // if deleted = true, change status to cancelled and update available / reserved licenses
    // in this situation, the frontend will simply provide the current workshop request data
    // and not alter it beyond the workshop status
    if (deleted) {
      // update workshop with change log
      const updateWorkshop = ctx.prisma.workshops.update({
        where: { workshop_id },
        data: {
          deleted: true,
          workshop_status: 'CANCELLED',
          workshop_change_log: {
            create: {
              created_by: ctx.req.session.manager_id!,
              created_at: new Date(),
              note: 'workshop request cancelled',
            },
          },
          workshop_notes: {
            create: {
              created_by: ctx.req.session.manager_id!,
              created_at: new Date(),
              note: note || 'workshop request cancelled',
            },
          },
        },
      })

      // update available and reserved licenses
      // no course or client changes are allowed owing to the EditWorkshopInput fields
      // so this can be a straightforward update of the available and reserved licenses
      const updated_amount =
        available_licenses.remaining_amount + reservedLicenses.reserved_amount

      const updateLicenses = ctx.prisma.available_licenses.update({
        where: { license_id: available_licenses.license_id },
        data: {
          remaining_amount: updated_amount,
          last_updated: new Date(),
          // update reserved licenses
          reserved_licenses: {
            update: {
              where: {
                reserved_license_id,
              },
              data: { reserved_status: 'CANCELLED' },
            },
          },
          // create license change note
          license_changes: {
            create: {
              created_by: ctx.req.session.manager_id!,
              created_at: new Date(),
              amount_change: reservedLicenses.reserved_amount,
              updated_amount,
              reserved_license_id,
              change_note: `Workshop Request ${workshop_id} cancelled and ${reservedLicenses.reserved_amount} reserved licenses released, bringing available licenses back to ${updated_amount}`,
            },
          },
        },
      })
      // run queries in a transaction
      return ctx.prisma.$transaction([updateWorkshop, updateLicenses])
    }
    // ! double check license checks filter out cancelled reservations

    // if the workshop request should be edited, validate it first
    const validationResult = await validateWorkshopRequest({
      workshopDetails,
      sessionDetails,
      client_id: workshopRequest.client_id,
      prisma: ctx.prisma,
    })

    if (validationResult instanceof TimeConflictError) {
      return validationResult
    }
    // remove old sessions, create new sessions, and update workshop
    // update available and reserved licenses
    // run queries in a transaction

    // remove old sessions
    const removeOldSessions = ctx.prisma.workshop_sessions.deleteMany({
      where: { workshop_id },
    })

    // update workshop and generate new sessions
    const formattedNewSessions = sessionDetails.map((session) => ({
      ...session,
      created_by: ctx.req.session.manager_id!,
      created_at: new Date(),
    }))
    const updateWorkshop = ctx.prisma.workshops.update({
      where: { workshop_id },
      data: {
        ...workshopDetails,
        workshop_sessions: { createMany: { data: formattedNewSessions } },
      },
    })

    // ! validation check against license counts should adjust number first, ie, if 18 licenses goes to 20, check for 2 more, not 20 more
    // ! double check active / inactive breakpoints
    // ! fix available/ reserved licenses when reactivating cancelled workshop
    // update available and reserved licenses
    // NOTE: in the current version, editing client and course is disabled
    // so changes to license will always effect the same license_id and reserved_license_id
    // ! make optional based on class size changes
    const changeInReservedAmount =
      workshopDetails.class_size - reservedLicenses.reserved_amount
    const updatedAvailableLicenseAmount =
      available_licenses.remaining_amount - changeInReservedAmount

    const updateLicenses = ctx.prisma.available_licenses.update({
      where: { license_id: available_licenses.license_id },
      data: {
        remaining_amount: updatedAvailableLicenseAmount,
        reserved_licenses: {
          update: {
            where: { reserved_license_id },
            data: {
              last_updated: new Date(),
              reserved_amount: workshopDetails.class_size,
            },
          },
        },
        license_changes: {
          create: {
            amount_change: -changeInReservedAmount,
            updated_amount:
              available_licenses.remaining_amount - changeInReservedAmount,
            change_note: `reserved license #${reserved_license_id} updated the reserved amount from ${workshopRequest.reserved_licenses[0].reserved_amount} to ${workshopDetails.class_size}, leaving ${updatedAvailableLicenseAmount} available licenses for license #${available_licenses.license_id}`,
            created_by: ctx.req.session.manager_id!,
            created_at: new Date(),
            reserved_license_id,
          },
        },
      },
    })

    // update manager assignments
    const deactivateManagerAssignments =
      ctx.prisma.manager_assignments.updateMany({
        where: { workshop_id, manager_id: { notIn: managers } },
        data: { active: false },
      })
    const reactivateManagerAssignments =
      ctx.prisma.manager_assignments.updateMany({
        where: { workshop_id, manager_id: { in: managers }, active: false },
        data: { active: true },
      })

    const currentManagerIDs = workshopRequest.manager_assignments.map(
      (manager) => manager.manager_id
    )
    const newManagerIDs = managers.filter(
      (managerID) => !currentManagerIDs.includes(managerID)
    )
    const newManagerAssignments = newManagerIDs.map((manager_id) => ({
      active: true,
      workshop_id,
      manager_id,
    }))
    const createNewManagerAssignments =
      ctx.prisma.manager_assignments.createMany({ data: newManagerAssignments })

    const updateManagerAssignments = [
      deactivateManagerAssignments,
      reactivateManagerAssignments,
      createNewManagerAssignments,
    ]

    // run queries as a transaction
    const result = await ctx.prisma.$transaction([
      removeOldSessions,
      updateWorkshop,
      updateLicenses,
      ...updateManagerAssignments,
    ])

    // return updated workshop object
    return result[1]
  }

  // coordinator only - update scheduling status to anything but requested / assigned
  // coordinators can provide updates on the scheduling status
  // however, if the workshop request has been assigned / cancelled / reset to requested
  // then this will be run through a change request to confirm with the manager's party
  @CoordinatorOrAdminOnly()
  @Mutation(() => CreateWorkshopResultUnion)
  async updateSchedulingStatus(
    @Ctx() ctx: Context,
    @Arg('workshop_id', () => Int) workshop_id: number,
    @Arg('newStatus', () => SCHEDULING_PROCESS) newStatus: SCHEDULING_PROCESS,
    @Arg('note', () => String, { nullable: true }) note?: string
  ) {
    // confirm coordinator (via middleware)
    // confirm workshop status is not scheduled, completed, or cancelled
    const workshop = await ctx.prisma.workshops.findFirst({
      where: { workshop_id },
    })
    if (!workshop) {
      throw new CustomError('No such workshop found!')
    }
    if (
      ['SCHEDULED', 'COMPLETED', 'CANCELLED'].includes(workshop.workshop_status)
    ) {
      throw new CustomError(
        'For a workshop that has been scheduled, completed, or cancelled, changing the status will require a change request'
      )
    }
    // directly update scheduling status, without needing to submit change request
    // generate workshop note if provided
    const workshopNote = note
      ? {
          create: {
            created_by: ctx.req.session.manager_id!,
            created_at: new Date(),
            note,
          },
        }
      : {}

    return ctx.prisma.workshops.update({
      where: { workshop_id },
      data: {
        workshop_status: newStatus,
        workshop_change_log: {
          create: {
            created_by: ctx.req.session.manager_id!,
            created_at: new Date(),
            note: `Coordinator changed workshop status to ${newStatus}`,
          },
        },
        workshop_notes: workshopNote,
      },
    })
  }

  // confirm workshop complete and verify final license count, triggering any license count adjustments
  @Authenticated()
  @Mutation(() => Workshop)
  async confirmWorkshopComplete(
    @Ctx() ctx: Context,
    @Arg('workshop_id', () => Int) workshop_id: number,
    @Arg('finalLicenseCount', () => Int) finalLicenseCount: number,
    @Arg('note', () => String, { nullable: true }) note?: string
  ) {
    // get workshop
    const workshop = await ctx.prisma.workshops.findFirst({
      where: { workshop_id },
      include: {
        clients: { include: { available_licenses: true } },
        reserved_licenses: true,
      },
    })

    // reject if workshop not found, not scheduled, or final workshop date not passed
    if (!workshop) {
      throw new CustomError('No such workshop found!')
    }
    if (workshop.workshop_status !== 'SCHEDULED') {
      throw new CustomError(
        'Only a workshop that is currently in SCHEDULED status can be finalized!'
      )
    }
    if (workshop.workshop_end_time > new Date()) {
      throw new CustomError(
        'Workshop is still in process and cannot be finalized yet!'
      )
    }

    // pull out available and reserved licenses
    const availableLicenses = workshop.clients.available_licenses.find(
      (license) => license.course_id === workshop.course_id
    )
    const reservedLicenses = workshop.reserved_licenses[0]
    // throw error if available and reserved licenses not found
    if (!availableLicenses || !reservedLicenses) {
      throw Error(
        `available and reserved licenses not found when attempting to finalze workshop #${workshop_id}`
      )
    }

    // generate workshop note if provided
    const workshopNote = note
      ? {
          create: {
            created_by: ctx.req.session.manager_id!,
            created_at: new Date(),
            note,
          },
        }
      : {}

    // finalize workshop and resolve reserved licenses
    if (finalLicenseCount === workshop.class_size) {
      // finalize with no license count change
      return ctx.prisma.workshops.update({
        where: { workshop_id },
        data: {
          workshop_status: 'COMPLETED',
          workshop_notes: workshopNote,
          workshop_change_log: {
            create: {
              created_at: new Date(),
              created_by: ctx.req.session.manager_id!,
              note: `workshop finalized using ${finalLicenseCount} reserved licenses`,
            },
          },
          reserved_licenses: {
            update: {
              where: {
                reserved_license_id: reservedLicenses.reserved_license_id,
              },
              data: {
                reserved_status: 'FINALIZED',
                license_changes: {
                  create: {
                    amount_change: 0,
                    updated_amount: availableLicenses.remaining_amount,
                    created_by: ctx.req.session.manager_id!,
                    created_at: new Date(),
                    license_id: availableLicenses.license_id,
                    workshop_id,
                    change_note:
                      'reserved licenses finalized with no change to reserved amounts',
                  },
                },
              },
            },
          },
        },
      })
    } else {
      const changeToReservedAmount =
        finalLicenseCount - reservedLicenses.reserved_amount
      const updatedAvailableLicenseAmount =
        availableLicenses?.remaining_amount - changeToReservedAmount
      if (updatedAvailableLicenseAmount < 0) {
        throw new CustomError(
          'This client does not have enough licenses to cover the adjusted class size!'
        )
      }

      const updateWorkshop = ctx.prisma.workshops.update({
        where: { workshop_id },
        data: {
          workshop_status: 'COMPLETED',
          workshop_notes: workshopNote,
          workshop_change_log: {
            create: {
              created_at: new Date(),
              created_by: ctx.req.session.manager_id!,
              note: `workshop finalized with adjustment of final license count from ${workshop.class_size} to ${finalLicenseCount}`,
            },
          },
        },
      })
      const updateLicenses = ctx.prisma.available_licenses.update({
        where: { license_id: availableLicenses.license_id },
        data: {
          remaining_amount: updatedAvailableLicenseAmount,
          last_updated: new Date(),
          reserved_licenses: {
            update: {
              where: {
                reserved_license_id: reservedLicenses.reserved_license_id,
              },
              data: {
                reserved_status: 'FINALIZED',
                reserved_amount: finalLicenseCount,
              },
            },
          },
          license_changes: {
            create: {
              created_at: new Date(),
              created_by: ctx.req.session.manager_id!,
              amount_change: changeToReservedAmount,
              reserved_license_id: reservedLicenses.reserved_license_id,
              change_note: `reserved licenses changed from ${reservedLicenses.reserved_amount} to ${finalLicenseCount} and resolved, leaving ${updatedAvailableLicenseAmount} remaining available licenses`,
              updated_amount: updatedAvailableLicenseAmount,
              workshop_id,
            },
          },
        },
      })

      // run updates in a transaction
      const result = await ctx.prisma.$transaction([
        updateWorkshop,
        updateLicenses,
      ])

      // return just the workshop data
      return result[0]
    }
  }
}
