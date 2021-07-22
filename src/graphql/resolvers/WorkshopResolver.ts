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
} from 'type-graphql'
import { Workshop } from '../objects/Workshop'
import { WorkshopSession } from '../objects/Session'
import { WorkshopNote } from '../objects/WorkshopNote'
import { ChangeLog } from '../objects/WorkshopChangeLog'
import { Manager } from '../objects/Manager'
import { Context } from '../../utils/context'
import { Course } from '../objects/Course'
import { Coursework } from '../objects/Coursework'
import { Client } from '../objects/Client'
import { Advisor } from '../objects/Advisor'
import { Authenticated } from '../../middleware/authChecker'

import {
  WorkshopsOrderBy,
  parseWorkshopOrderByArgs,
  WorkshopFilterOptions,
  parseWorkshopWhereArgs,
} from '../searchOptions/WorkshopSearch'
import {
  CreateWorkshopInput,
  //formatCreateWorkshopInput,
} from '../searchOptions/workshopInput'
import { CreateSessionInput } from '../searchOptions/SessionInput'
import { SESSION_STATUS } from '../enums/SESSION_STATUS'
import { nanoid } from 'nanoid'

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

  // backup requested advisor
  @FieldResolver(() => [Advisor])
  backupRequestedAdvisor(@Ctx() ctx: Context, @Root() root: Workshop) {
    return ctx.prisma.workshops
      .findUnique({ where: { workshop_id: root.workshop_id } })
      .advisors_advisorsToworkshops_backup_requested_advisor_id()
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
      .change_log()
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
  @Mutation(() => Workshop)
  addWorkshop(
    @Ctx() ctx: Context,
    @Arg('workshopDetails', () => CreateWorkshopInput)
    workshopDetails: CreateWorkshopInput,
    @Arg('sessionDetails', () => [CreateSessionInput])
    sessionDetails: CreateSessionInput[],
    @Arg('managers', () => [Int]) managers: number[],
    @Arg('notes', { nullable: true }) notes: string[]
  ) {
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

    // add validation
    // confirm unique cohort name
    // confirm no time conflicts for requested advisor
    // confirm reasonable time based on region (note: set up as warning on frontend)

    return ctx.prisma.workshops.create({
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
        change_log: { create: { note: 'workshop created' } },
        // license
      },
    })
  }

  // update workshop // distinct from updating sessions, just for workshop meta data, again one off, but need to update change log
  // delete workshop (move to trash, can still be restored)
  // restore workshops
  // permadelete workshop (cascade delete sessions, workshop notes, change_log)
}
