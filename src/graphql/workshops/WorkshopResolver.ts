import {
  Resolver,
  FieldResolver,
  Query,
  Arg,
  Int,
  Ctx,
  Root,
  Mutation,
  //InputType,
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
import { Authenticated } from '../../middleware/authChecker'
import { DateTime } from 'luxon'

import {
  WorkshopsOrderBy,
  parseWorkshopOrderByArgs,
  WorkshopFilterOptions,
  parseWorkshopWhereArgs,
} from './searchOptions/WorkshopSearch'
import {
  CreateWorkshopInput,
  //formatCreateWorkshopInput,
} from './searchOptions/workshopInput'
import { CreateSessionInput } from './searchOptions/SessionInput'
import { SESSION_STATUS } from '../enums/SESSION_STATUS'
import { nanoid } from 'nanoid'
import { hasTimeConflict, TimeConflictError } from '../../utils/dateTime'

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

@Resolver(Workshop)
export class WorkshopResolver {
  /* ----------------------------- field resolvers ---------------------------- */

  // assigned advisor
  @FieldResolver(() => [Advisor])
  assignedAdvisor(@Ctx() ctx: Context, @Root() root: Workshop) {
    return ctx.prisma.workshops
      .findUnique({ where: { workshop_id: root.workshop_id } })
      .advisors_advisorsToworkshops_assigned_advisor_id()
  }

  // requested advisor
  @FieldResolver(() => [Advisor])
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
    /* ------------- check for active client and sufficient licenses ------------ */
    const clientWithLicenses = await ctx.prisma.clients.findFirst({
      where: { client_id: workshopDetails.client_id },
      include: {
        available_licenses: { where: { course_id: workshopDetails.course_id } },
      },
    })

    if (!clientWithLicenses) throw Error('No such client found!')
    if (!clientWithLicenses.active) throw Error('Client is currently inactive!')

    const updatedAvailableLicenseAmount =
      clientWithLicenses.available_licenses[0].remaining_amount -
      workshopDetails.class_size
    if (updatedAvailableLicenseAmount < 0)
      throw Error('Not enough licenses for this course!')

    /* --------------- if requested advisor check for availability -------------- */
    if (workshopDetails.requested_advisor_id) {
      /* -------- check that advisor is not inactive or marked as unavaialble that day -------- */

      const advisorAvailability = await ctx.prisma.advisors.findFirst({
        where: { advisor_id: workshopDetails.requested_advisor_id },
        include: { unavailable_days: true },
      })
      if (!advisorAvailability) throw Error('No such advisor found!')
      if (!advisorAvailability.active)
        throw Error('Advisor is not currently active!')
      const requestedDates = sessionDetails.map((session) =>
        DateTime.fromJSDate(session.start_time).toISODate()
      )
      const unavailableDays = advisorAvailability.unavailable_days.map((day) =>
        DateTime.fromJSDate(day.day_unavailable).toISODate()
      )
      const unavailableRequestedDates = unavailableDays.filter((date) =>
        requestedDates.includes(date)
      )
      if (unavailableRequestedDates.length) {
        return {
          error: true,
          unavailableDays: unavailableRequestedDates,
        }
      }

      /* -------------------- check for session time confilicts ------------------- */

      // map start and end times used when checking for time conflicts
      const requestedSessionTimes = sessionDetails.map((session) => ({
        requestedStartTime: session.start_time,
        requestedEndTime: session.end_time,
      }))

      // check for time conflicts
      const timeConflicts = await hasTimeConflict({
        advisor_id: workshopDetails.requested_advisor_id,
        requests: requestedSessionTimes,
        prisma: ctx.prisma,
      })

      // if time conflict found, reject with detail on where time conflict arose
      if (timeConflicts) {
        return {
          error: true,
          timeConflicts,
        }
      }
    }

    /* -------------- format sub fields and create workshop request ------------- */
    // format sessions objects
    const sessions = sessionDetails.map((session) => ({
      ...session,
      session_status: SESSION_STATUS.REQUESTED,
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
        workshop_status: SESSION_STATUS.REQUESTED,
        deleted: false,
        participant_sign_up_link: nanoid(),
        // password for sign_up_link?
        launch_participant_sign_ups: false,
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

  // update workshop // distinct from updating sessions, just for workshop meta data, again one off, but need to update change log
  // when updating/ deleting workshop/ restoring, need to update license counts
  // what if editing course type?

  // delete workshop (move to trash, can still be restored)
  @Authenticated()
  @Mutation(() => Workshop)
  async deleteWorkshop(
    @Ctx() ctx: Context,
    @Arg('workshop_id', () => Int) workshop_id: number,
    @Arg('note', { nullable: true }) note?: string
  ) {
    // get reservedLicenses
    const reservedLicenses = await ctx.prisma.reserved_licenses.findFirst({
      where: { workshop_id },
      include: { available_licenses: true },
    })
    if (!reservedLicenses)
      throw Error('No such workshop / resereved licenses found!')
    const updatedAvailableLicenseAmount =
      reservedLicenses.available_licenses.remaining_amount +
      reservedLicenses.reserved_amount

    // format optional note
    const create_workshop_note = note
      ? {
          create: {
            created_by: ctx.req.session.manager_id!,
            created_at: new Date(),
            note,
          },
        }
      : {}
    // switch status to cancelled and deleted to true
    // update workshop change log
    // update session status
    const deleteWorkshop = ctx.prisma.workshops.update({
      where: { workshop_id },
      data: {
        deleted: true,
        workshop_status: 'CANCELLED',
        workshop_sessions: {
          updateMany: {
            where: { workshop_id },
            data: { session_status: 'CANCELLED' },
          },
        },
        workshop_change_log: {
          create: {
            created_by: ctx.req.session.manager_id!,
            created_at: new Date(),
            note: 'workshop deleted',
          },
        },
        workshop_notes: {
          ...create_workshop_note,
        },
      },
    })
    // update available licenses
    const updateAvailableLicenses = ctx.prisma.available_licenses.update({
      where: { license_id: reservedLicenses.license_id },
      data: {
        last_updated: new Date(),
        // add reserved license amount back to available licenses
        remaining_amount: updatedAvailableLicenseAmount,
        license_changes: {
          create: {
            amount_change: reservedLicenses.reserved_amount,
            updated_amount: updatedAvailableLicenseAmount,
            created_by: ctx.req.session.manager_id!,
            created_at: new Date(),
            change_note: `workshop #${workshop_id} removed and ${reservedLicenses.reserved_amount} reserved licenses added back to available licenses`,
          },
        },
        reserved_licenses: {
          updateMany: {
            where: { workshop_id },
            data: {
              last_updated: new Date(),
              reserved_status: 'CANCELLED',
            },
          },
        },
      },
    })

    // run workshop delete and license updates as transaction
    const result = await ctx.prisma.$transaction([
      deleteWorkshop,
      updateAvailableLicenses,
    ])

    // return deleted workshop info
    return result[0]
  }
  // restore workshops
  @Authenticated()
  @Mutation(() => Workshop)
  async restoreWorkshop(
    @Ctx() ctx: Context,
    @Arg('workshop_id', () => Int) workshop_id: number
  ) {
    // get reservedLicenses
    const reservedLicenses = await ctx.prisma.reserved_licenses.findFirst({
      where: { workshop_id },
      include: { available_licenses: true },
    })
    if (!reservedLicenses)
      throw Error('No such workshop / resereved licenses found!')
    const updatedAvailableLicenseAmount =
      reservedLicenses.available_licenses.remaining_amount -
      reservedLicenses.reserved_amount
    if (updatedAvailableLicenseAmount < 0) {
      throw Error(
        'Not enough available licenses to reserve this workshop again!'
      )
      // add optional updated reserved amount for recreating workshop but with fewer licenses?
    }
    // switch status to requested and deleted to false
    // update workshop change log
    // update session status 0 check dates again?
    const restoreWorkshop = ctx.prisma.workshops.update({
      where: { workshop_id },
      data: {
        workshop_status: 'REQUESTED',
        deleted: false,
        workshop_sessions: {},
        workshop_notes: {},
      },
    })

    // update available and reserved licenses
    const updateLicenseAmounts = ctx.prisma.available_licenses.update({
      where: { license_id: reservedLicenses.license_id },
      data: {
        last_updated: new Date(),
        // add reserved license amount back to available licenses
        remaining_amount: updatedAvailableLicenseAmount,
        license_changes: {
          create: {
            amount_change: -reservedLicenses.reserved_amount,
            updated_amount: updatedAvailableLicenseAmount,
            created_by: ctx.req.session.manager_id!,
            created_at: new Date(),
            change_note: `workshop #${workshop_id} restored and ${reservedLicenses.reserved_amount} reserved licenses removed from available licenses`,
          },
        },
        reserved_licenses: {
          updateMany: {
            where: { workshop_id },
            data: {
              last_updated: new Date(),
              reserved_status: 'RESERVED',
            },
          },
        },
      },
    })

    // run restore workshop and update licenses as transaction
    const result = await ctx.prisma.$transaction([
      restoreWorkshop,
      updateLicenseAmounts,
    ])

    // return restored workshop
    return result[0]
  }
}
