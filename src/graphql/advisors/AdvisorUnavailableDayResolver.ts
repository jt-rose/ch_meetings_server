import { PrismaClient } from '@prisma/client'
import { AdvisorUnavailableDay } from './AdvisorUnavailableDay'
import {
  Resolver,
  Arg,
  Ctx,
  Int,
  Mutation,
  InputType,
  Field,
} from 'type-graphql'
import { Context } from '../../utils/context'
import { Authenticated } from '../../middleware/authChecker'

@InputType()
class UnavailableDayInfo {
  @Field(() => Int)
  advisor_id: number

  @Field(() => Date)
  day_unavailable: Date

  @Field({ nullable: true })
  note?: string
}

@InputType()
class UnavailableDayInfoWithID extends UnavailableDayInfo {
  @Field(() => Int)
  unavailable_id: number
}

// reject adding/ updating an advisor's unavailable days if they are already scheduled
// to a workshop - this should help avoid any oversights
const rejectIfAdvisorAlreadyScheduled = async (
  prisma: PrismaClient,
  advisor_id: number,
  day_unavailable: Date
) => {
  // NOTE: due to a quirk of prisma, the date variable below needs to be entered
  // as an actual Date Object and not the string equivalent
  // issue described here: https://github.com/prisma/prisma/discussions/4347
  const sameDateScheduled = await prisma.$queryRaw<{ count: number }[]>`
    SELECT COUNT(*) FROM workshop_sessions
    LEFT JOIN workshops
    ON workshop_sessions.workshop_id = workshops.workshop_id
    WHERE DATE(workshop_sessions.start_time) = ${day_unavailable}
    AND workshops.assigned_advisor_id = ${advisor_id}
    `

  if (sameDateScheduled[0].count !== 0) {
    throw Error(
      'This advisor is currently scheduled for a workshop session on this date'
    )
  }
}

// Advisor unavailable days will be kept simple and
// read as a field resolver/ join on the Advisor data
// therefore, no read functionality is needed in this resolver

@Resolver(AdvisorUnavailableDay)
export class UnavailableDayResolver {
  @Authenticated()
  @Mutation(() => AdvisorUnavailableDay)
  async addAdvisorUnavailableDay(
    @Ctx() ctx: Context,
    @Arg('unavailable_day_info', () => UnavailableDayInfo)
    unavailable_day_info: UnavailableDayInfo
  ) {
    const { advisor_id, day_unavailable, note } = unavailable_day_info

    await rejectIfAdvisorAlreadyScheduled(
      ctx.prisma,
      advisor_id,
      day_unavailable
    )

    return ctx.prisma.unavailable_days.create({
      data: { advisor_id, day_unavailable, note },
    })
  }

  @Authenticated()
  @Mutation(() => AdvisorUnavailableDay)
  async editAdvisorUnavailableDay(
    @Ctx() ctx: Context,
    @Arg('unavailable_day_info', () => UnavailableDayInfoWithID)
    unavailable_day_info: UnavailableDayInfoWithID
  ) {
    const { unavailable_id, advisor_id, day_unavailable, note } =
      unavailable_day_info

    await rejectIfAdvisorAlreadyScheduled(
      ctx.prisma,
      advisor_id,
      day_unavailable
    )

    return ctx.prisma.unavailable_days.update({
      where: { unavailable_id },
      data: { advisor_id, day_unavailable, note },
    })
  }

  @Authenticated()
  @Mutation(() => AdvisorUnavailableDay)
  async removeAdvisorUnavailableDay(
    @Ctx() ctx: Context,
    @Arg('unavailable_id', () => Int) unavailable_id: number
  ) {
    return ctx.prisma.unavailable_days.delete({ where: { unavailable_id } })
  }
}
