import { AdvisorUnavailableTime } from './AdvisorUnavailableTime'
import {
  Resolver,
  Arg,
  Ctx,
  Int,
  Mutation,
  InputType,
  Field,
  createUnionType,
} from 'type-graphql'
import { Context } from '../../utils/context'
import { Authenticated } from '../../middleware/authChecker'
import {
  hasTimeConflict,
  hasUnavailableTimesConflict,
  hasSessionTimeConflict,
  TimeConflictError,
} from '../workshops/workshop_utils/checkTimeConflicts'

@InputType()
class UnavailableTimeInfo {
  @Field(() => Int)
  advisor_id: number

  @Field(() => Date)
  unavailable_start_time: Date

  @Field(() => Date)
  unavailable_end_time: Date

  @Field({ nullable: true })
  note?: string
}

@InputType()
class UnavailableTimeInfoWithID extends UnavailableTimeInfo {
  @Field(() => Int)
  unavailable_id: number
}

// generate success / error union type when creating/ editing workshop
const UnavailableTimeResultUnion = createUnionType({
  name: 'UnavailableTimeResult',
  types: () => [AdvisorUnavailableTime, TimeConflictError] as const,
  resolveType: (value) => {
    if ('conflicts' in value) {
      return TimeConflictError
    }
    if ('unavailable_id' in value) {
      return AdvisorUnavailableTime
    }
    return undefined
  },
})

// Advisor unavailable times will be kept simple and
// read as a field resolver/ join on the Advisor data
// therefore, no read functionality is needed in this resolver

@Resolver(AdvisorUnavailableTime)
export class AdvisorUnavailableTimeResolver {
  @Authenticated()
  @Mutation(() => UnavailableTimeResultUnion)
  async addAdvisorUnavailableDay(
    @Ctx() ctx: Context,
    @Arg('unavailable_time_info', () => UnavailableTimeInfo)
    unavailable_time_info: UnavailableTimeInfo
  ) {
    const { advisor_id, unavailable_start_time, unavailable_end_time, note } =
      unavailable_time_info

    const timeConflicts = await hasTimeConflict({
      advisor_id: 1,
      prisma: ctx.prisma,
      requests: [
        {
          requestedStartTime: unavailable_start_time,
          requestedEndTime: unavailable_end_time,
        },
      ],
    })

    if (timeConflicts) return timeConflicts

    return ctx.prisma.advisor_unavailable_times.create({
      data: { advisor_id, unavailable_start_time, unavailable_end_time, note },
    })
  }

  @Authenticated()
  @Mutation(() => UnavailableTimeResultUnion)
  async editAdvisorUnavailableDay(
    @Ctx() ctx: Context,
    @Arg('unavailable_time_info', () => UnavailableTimeInfoWithID)
    unavailable_time_info: UnavailableTimeInfoWithID
  ) {
    const {
      unavailable_id,
      advisor_id,
      unavailable_start_time,
      unavailable_end_time,
      note,
    } = unavailable_time_info

    const sessionConflicts = await hasSessionTimeConflict({
      advisor_id,
      prisma: ctx.prisma,
      requests: [
        {
          requestedStartTime: unavailable_start_time,
          requestedEndTime: unavailable_end_time,
        },
      ],
    })

    if (sessionConflicts) return sessionConflicts

    const unavailableConflicts = await hasUnavailableTimesConflict({
      advisor_id: 1,
      prisma: ctx.prisma,
      requests: [
        {
          requestedStartTime: unavailable_start_time,
          requestedEndTime: unavailable_end_time,
        },
      ],
    })

    // remove unavailable time that is currently being edited
    // and return time conflict error if any other time conflicts remain
    if (unavailableConflicts) {
      const unavailableConflictsWithoutSelf =
        unavailableConflicts.conflicts.filter(
          (conflict) => conflict.unavailable_id !== unavailable_id
        )
      if (unavailableConflictsWithoutSelf.length) {
        return {
          ...unavailableConflicts,
          conflicts: unavailableConflictsWithoutSelf,
        }
      }
    }

    return ctx.prisma.advisor_unavailable_times.update({
      where: { unavailable_id },
      data: { advisor_id, unavailable_start_time, unavailable_end_time, note },
    })
  }

  @Authenticated()
  @Mutation(() => AdvisorUnavailableTime)
  async removeAdvisorUnavailableDay(
    @Ctx() ctx: Context,
    @Arg('unavailable_id', () => Int) unavailable_id: number
  ) {
    return ctx.prisma.advisor_unavailable_times.delete({
      where: { unavailable_id },
    })
  }
}
