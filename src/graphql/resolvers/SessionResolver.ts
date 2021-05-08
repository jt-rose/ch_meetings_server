import { Resolver, Query, Arg, Ctx } from 'type-graphql'
import { WorkshopSession } from '../objects/sessions'
import { Context } from '../../utils/context'

@Resolver(WorkshopSession)
export class WorkshopSessionResolver {
  @Query(() => [WorkshopSession])
  async getSession(@Arg('sessionID') sessionID: number, @Ctx() ctx: Context) {
    return ctx.prisma.workshop_sessions.findMany({
      where: { workshop_session_id: sessionID },
    })
  }
}
