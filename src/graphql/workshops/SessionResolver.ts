import { Resolver, Query, Mutation, Arg, Int, Ctx } from 'type-graphql'
import { WorkshopSession } from './Session'
import {
  CreateSessionInput,
  EditSessionInput,
} from './searchOptions/SessionInput'
import { Context } from '../../utils/context'
import { Authenticated } from '../../middleware/authChecker'

@Resolver(WorkshopSession)
export class WorkshopSessionResolver {
  /* ------------------------------ session CRUD ------------------------------ */

  // find the session of a given workshop
  @Authenticated()
  @Query(() => [WorkshopSession])
  getSessions(@Ctx() ctx: Context, @Arg('sessionID') sessionID: number) {
    return ctx.prisma.workshop_sessions.findMany({
      where: { workshop_session_id: sessionID },
    })
  }

  // create an additional session
  // separate from the sessions created when initially
  // creating the workshop
  @Authenticated()
  @Mutation(() => WorkshopSession)
  createSession(
    @Ctx() ctx: Context,
    @Arg('workshop_id', () => Int) workshop_id: number,
    @Arg('sessionInfo', () => CreateSessionInput)
    sessionInfo: CreateSessionInput
  ) {
    // add validation - check for time conflicts/ name conflicts
    return ctx.prisma.workshop_sessions.create({
      data: {
        ...sessionInfo,
        created_by: ctx.req.session.manager_id!,
        session_status: 'REQUESTED',
        workshop_id,
      },
    })
  }

  // edit an individual session
  @Authenticated()
  @Mutation(() => WorkshopSession)
  editSession(
    @Ctx() ctx: Context,
    @Arg('sessionID', () => Int) sessionID: number,
    @Arg('updatedInfo', () => EditSessionInput) updatedInfo: EditSessionInput
  ) {
    // add validation - check for time conflicts/ name conflicts
    return ctx.prisma.workshop_sessions.update({
      where: { workshop_session_id: sessionID },
      data: {
        ...updatedInfo,
      },
    })
  }

  // delete an individual session
  @Authenticated()
  @Mutation(() => WorkshopSession)
  deleteSession(@Ctx() ctx: Context, @Arg('sessionID') sessionID: number) {
    return ctx.prisma.workshop_sessions.delete({
      where: { workshop_session_id: sessionID },
    })
  }
}
