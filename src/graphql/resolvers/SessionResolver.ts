import { Resolver, FieldResolver, Root, Query, Arg, Ctx } from 'type-graphql'
import { WorkshopSession } from '../objects/Session'
import { RequestedStartTime } from './../objects/RequestedStartTime'
import { Context } from '../../utils/context'

@Resolver(WorkshopSession)
export class WorkshopSessionResolver {
  /* ----------------------------- field resolvers ---------------------------- */

  @FieldResolver(() => [RequestedStartTime])
  async requested_start_times(
    @Ctx() ctx: Context,
    @Root() workshopSession: WorkshopSession
  ) {
    return ctx.prisma.requested_start_times.findMany({
      where: { workshop_session_id: workshopSession.workshop_session_id },
    })
  }

  /* ------------------------------ session CRUD ------------------------------ */
  // rework with dataloader
  @Query(() => [WorkshopSession])
  async getSession(@Arg('sessionID') sessionID: number, @Ctx() ctx: Context) {
    return ctx.prisma.workshop_sessions.findMany({
      where: { workshop_session_id: sessionID },
    })
  }

  // sessions will be created and deleted as a set connected to the workshop
  // so no need to create an individual "createSession" or "deleteSession" resolver

  // updateSession
}
