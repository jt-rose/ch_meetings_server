import { Resolver, Query, Mutation, Int, Arg, Ctx } from 'type-graphql'
import { Context } from '../../utils/context'
import { AdminOnly } from '../../middleware/authChecker'
import { ErrorLog } from './ErrorLog'
import { ORDERBY_DIRECTION } from '../enums/ORDERBY_DIRECTION'

@Resolver(ErrorLog)
export class ErrorLogResolver {
  @AdminOnly()
  @Query(() => [ErrorLog])
  getAllErrorLogs(
    @Ctx() ctx: Context,
    @Arg('skip', () => Int) skip: number,
    @Arg('take', () => Int) take: number,
    @Arg('orderBy', () => ORDERBY_DIRECTION) orderBy: ORDERBY_DIRECTION,
    @Arg('lte', () => Date, { nullable: true }) lte?: Date,
    @Arg('gte', () => Date, { nullable: true }) gte?: Date,
    @Arg('manager_id', () => Int, { nullable: true }) manager_id?: number
  ) {
    return ctx.prisma.error_log.findMany({
      skip,
      take,
      where: { error_time: { lte, gte }, manager_id },
      orderBy: { error_time: orderBy },
    })
  }

  @AdminOnly()
  @Mutation(() => ErrorLog)
  removeErrorLog(
    @Ctx() ctx: Context,
    @Arg('error_id', () => Int) error_id: number
  ) {
    return ctx.prisma.error_log.delete({ where: { error_id } })
  }
}
