import { Resolver, Query, Arg, Ctx } from 'type-graphql'
import { WorkshopSession } from '../objects/Session'
import { Context } from '../../utils/context'

@Resolver(WorkshopSession)
export class WorkshopSessionResolver {
  /* ----------------------------- field resolvers ---------------------------- */

  /* ------------ add resolvers for requested_start_times and notes ----------- */
  // ....

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
