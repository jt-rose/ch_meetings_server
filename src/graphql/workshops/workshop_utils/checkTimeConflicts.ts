import { PrismaClient, PrismaPromise } from '@prisma/client'
import { Field, ObjectType, Int } from 'type-graphql'
import { DateTime } from 'luxon'

/* ------------------- declare time conflict query results ------------------ */

// to simplify the graphql response object, this will cover time conflicts
// for both unavaialble times and workshop sessions
// with fields unique to each marked as nullable
@ObjectType()
export class TimeConflict {
  // NOTE: when running the raw SQL query through Prisma, the autommatic parsing
  // of strings into JS Date objects does not occur
  // to get around this, we will return these as strings and manually format them
  // when returning the response object
  @Field()
  start_time: string

  @Field()
  end_time: string

  @Field(() => Int)
  advisor_id: number

  // fields specific to unavailable times conflits
  @Field(() => Int, { nullable: true })
  unavailable_id?: number

  @Field({ nullable: true })
  note?: string

  // fields specific to session conflicts
  @Field(() => Int, { nullable: true })
  workshop_session_id?: number

  @Field(() => Int, { nullable: true })
  workshop_id?: number
}

/* -------------- database queries to check for time conflicts -------------- */

// function arguments for generating for sql queries
interface FindTimeConflictsConfig {
  advisor_id: number
  requestedStartTime: Date
  requestedEndTime: Date
  prisma: PrismaClient
}

// create a sql query that will run in a transaction
// to check for conflicts with the advisor's unavailable times
const findAdvisorUnavailableTimeConflicts = (
  config: FindTimeConflictsConfig
) => config.prisma.$queryRaw<TimeConflict[]>`
SELECT unavailable_id, unavailable_start_time AS start_time, unavailable_end_time AS end_time, note, advisor_id
FROM advisor_unavailable_times
WHERE advisor_id = ${config.advisor_id}
AND ((unavailable_start_time BETWEEN ${config.requestedStartTime} AND ${config.requestedEndTime})
OR (unavailable_end_time BETWEEN ${config.requestedStartTime} AND ${config.requestedEndTime})
OR (unavailable_start_time <= ${config.requestedStartTime} AND unavailable_end_time >= ${config.requestedEndTime}))
`

// create a sql query that will run in a transaction
// to check for time conflics on an individual requested session
const findAdvisorSessionConflicts = (config: FindTimeConflictsConfig) => config
  .prisma.$queryRaw<TimeConflict[]>`
SELECT ws.workshop_session_id, ws.start_time, ws.end_time, ws.workshop_id, workshops.assigned_advisor_id AS advisor_id
FROM workshop_sessions AS ws
JOIN workshops ON ws.workshop_id = workshops.workshop_id
WHERE workshops.assigned_advisor_id = ${config.advisor_id}
AND ((ws.start_time BETWEEN ${config.requestedStartTime} AND ${config.requestedEndTime})
OR (ws.end_time BETWEEN ${config.requestedStartTime} AND ${config.requestedEndTime})
OR (ws.start_time <= ${config.requestedStartTime} AND ws.end_time >= ${config.requestedEndTime}))
`

/* -------------------- format discovered time conflicts -------------------- */

// a sql query will run for each start/end time set
//and return all conflicts, resulting ina  type of TimeConflict[][]

// remove empty responses (i.e. no time conflicts found) and reformat ISO strings as Date objects
const formatTimeConflicts = (timeConflicts: TimeConflict[][]) =>
  timeConflicts
    .filter((conflicts) => conflicts.length !== 0)
    .flat()
    .map((conflict) => ({
      ...conflict,
      start_time: DateTime.fromISO(conflict.start_time)
        .toJSDate()
        .toISOString(),
      end_time: DateTime.fromISO(conflict.end_time).toJSDate().toISOString(),
    }))

/* --- batch sql queries in a transaction and return time conflicts found --- */

// check if requested session has conflict with an
// advisor's unavailable times or already scheduled sessions
// this will also show conflicts if one session ends right as another begins
// ex: one ends at 11 AM and another starts at 11 AM
// since this does not give the advisor adequate time to prepare
// and workshops may go slightly over (and then impacting the next one)
// this behavior is intended

// applies either an unavailble times query or a sessions query,
// and checks each start/end time set for availability
// returning time conflicts found for each, or false if none found
const formatQueryforTimeConflicts =
  (
    query:
      | typeof findAdvisorUnavailableTimeConflicts
      | typeof findAdvisorSessionConflicts
  ) =>
  async (config: {
    advisor_id: number
    requests: {
      requestedStartTime: Date
      requestedEndTime: Date
    }[]
    prisma: PrismaClient
  }) => {
    const { advisor_id, requests, prisma } = config

    // map individual queries
    const timeConflictQueries = requests.map((request) =>
      query({
        advisor_id,
        requestedStartTime: request.requestedStartTime,
        requestedEndTime: request.requestedEndTime,
        prisma,
      })
    )

    // run queries as single transaction
    const timeConflictsFound = await prisma.$transaction<
      PrismaPromise<TimeConflict[]>[]
    >(timeConflictQueries)

    // return formatted time conflicts if found
    if (timeConflictsFound.every((conflicts) => conflicts.length !== 0)) {
      return formatTimeConflicts(timeConflictsFound)
    }

    // return false if no time conflcits found
    return false
  }

// check for specific time conflicts
export const hasUnavailableTimesConflict = formatQueryforTimeConflicts(
  findAdvisorUnavailableTimeConflicts
)
export const hasSessionTimeConflict = formatQueryforTimeConflicts(
  findAdvisorSessionConflicts
)

// check for any time conflict
export const hasTimeConflict = async (config: {
  advisor_id: number
  requests: {
    requestedStartTime: Date
    requestedEndTime: Date
  }[]
  prisma: PrismaClient
}) => {
  const unavailableTimesConflict = await hasUnavailableTimesConflict(config)
  if (unavailableTimesConflict) return unavailableTimesConflict
  const sessionTimesConflict = await hasSessionTimeConflict(config)
  if (sessionTimesConflict) return sessionTimesConflict
  return false
}

/* ---------------- response object for time conflicts found ---------------- */

@ObjectType()
export class TimeConflictError {
  @Field()
  error: boolean

  @Field(() => [TimeConflict])
  timeConflicts: TimeConflict[]
}
