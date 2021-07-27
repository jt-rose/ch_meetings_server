import { PrismaClient, PrismaPromise } from '@prisma/client'
import { Field, ObjectType, Int } from 'type-graphql'
import { DateTime } from 'luxon'

@ObjectType()
class SameDaySession {
  @Field(() => Int)
  workshop_session_id: number

  // NOTE: when running the raw SQL query through Prisma, the autommatic parsing
  // of strings into JS Date objects does not occur
  // to get around this, we will return these as strings and manually format them
  // when returning the response object
  @Field()
  start_time: string

  @Field()
  end_time: string

  @Field(() => Int)
  workshop_id: number

  @Field(() => Int)
  assigned_advisor_id: number
}

@ObjectType()
export class TimeConflictError {
  @Field()
  error: boolean

  @Field(() => [SameDaySession])
  timeConflicts: SameDaySession[]
}

// create a batched sql query to check for time conflics on an individual requested session
const findAdvisorTimeConflicts = (config: {
  advisor_id: number
  requestedStartTime: Date
  requestedEndTime: Date
  prisma: PrismaClient
}) => config.prisma.$queryRaw<SameDaySession[]>`
SELECT ws.workshop_session_id, ws.start_time, ws.end_time, ws.workshop_id, workshops.assigned_advisor_id
FROM workshop_sessions AS ws
JOIN workshops ON ws.workshop_id = workshops.workshop_id
WHERE workshops.assigned_advisor_id = ${config.advisor_id}
AND ((ws.start_time BETWEEN ${config.requestedStartTime} AND ${config.requestedEndTime})
OR (ws.end_time BETWEEN ${config.requestedStartTime} AND ${config.requestedEndTime})
OR (ws.start_time <= ${config.requestedStartTime} AND ws.end_time >= ${config.requestedEndTime}))
`

// check if requested session has conflict with an already scheduled session
// this will also show conflicts if one session ends right as another begins
// ex: one ends at 11 AM and another starts at 11 AM
// since this does not give the advisor adequate time to prepare
// and workshops may go slightly over (and then impacting the next one)
// this behavior is intended
export const hasTimeConflict = async (config: {
  advisor_id: number
  requests: {
    requestedStartTime: Date
    requestedEndTime: Date
  }[]
  prisma: PrismaClient
}) => {
  const { advisor_id, requests, prisma } = config

  // batch queries checking for time conflicts
  const timeConflictQueries = requests.map((request) =>
    findAdvisorTimeConflicts({
      advisor_id,
      requestedStartTime: request.requestedStartTime,
      requestedEndTime: request.requestedEndTime,
      prisma,
    })
  )

  // run queries as single transaction
  const timeConflictsFound = await prisma.$transaction<
    PrismaPromise<SameDaySession[]>[]
  >(timeConflictQueries)

  // return false when no time conflicts found
  if (timeConflictsFound.every((conflicts) => conflicts.length === 0))
    return false

  // map requests to time conflicts found and filter out
  // requests with no conflicts
  return timeConflictsFound
    .filter((conflicts) => conflicts.length !== 0)
    .flat()
    .map((conflict) => ({
      ...conflict,
      start_time: DateTime.fromISO(conflict.start_time)
        .toJSDate()
        .toISOString(),
      end_time: DateTime.fromISO(conflict.end_time).toJSDate().toISOString(),
    }))
}
