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
  editing_id?: number
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
AND unavailable_id != ${config.editing_id || -1}
AND ((${
  config.requestedStartTime
} BETWEEN unavailable_start_time AND unavailable_end_time)
OR (${
  config.requestedEndTime
} BETWEEN unavailable_start_time AND unavailable_end_time)
OR (${config.requestedStartTime} <= unavailable_start_time AND ${
  config.requestedEndTime
} >= unavailable_end_time))
`

// create a sql query that will run in a transaction
// to check for time conflics on an individual requested session
const findAdvisorSessionConflicts = (config: FindTimeConflictsConfig) => config
  .prisma.$queryRaw<TimeConflict[]>`
SELECT ws.workshop_session_id, ws.start_time, ws.end_time, ws.workshop_id, workshops.assigned_advisor_id AS advisor_id
FROM workshop_sessions AS ws
JOIN workshops ON ws.workshop_id = workshops.workshop_id
WHERE workshops.assigned_advisor_id = ${config.advisor_id}
AND ws.workshop_session_id != ${config.editing_id || -1}
AND ((${config.requestedStartTime} BETWEEN ws.start_time AND ws.end_time)
OR (${config.requestedEndTime} BETWEEN ws.start_time AND ws.end_time)
OR (${config.requestedStartTime} <= ws.start_time AND ${
  config.requestedEndTime
} >= ws.end_time))
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
  (queryConfig: {
    query:
      | typeof findAdvisorUnavailableTimeConflicts
      | typeof findAdvisorSessionConflicts
    conflictType: string
    errorMessage: string
  }) =>
  async (config: {
    advisor_id: number
    editing_id?: number
    requests: {
      requestedStartTime: Date
      requestedEndTime: Date
    }[]
    prisma: PrismaClient
  }): Promise<TimeConflictError | false> => {
    const { advisor_id, editing_id, requests, prisma } = config

    // map individual queries
    const timeConflictQueries = requests.map((request) =>
      queryConfig.query({
        advisor_id,
        editing_id,
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
      return {
        conflictType: queryConfig.conflictType,
        errorMessage: queryConfig.errorMessage,
        timeConflicts: formatTimeConflicts(timeConflictsFound),
      }
    }

    // return false if no time conflcits found
    return false
  }

// check for specific time conflicts
export const hasUnavailableTimesConflict = formatQueryforTimeConflicts({
  query: findAdvisorUnavailableTimeConflicts,
  conflictType: 'Advisor Unavailable Times',
  errorMessage:
    'This advisor is already scheduled to be unavailable at this time',
})

export const hasSessionTimeConflict = formatQueryforTimeConflicts({
  query: findAdvisorSessionConflicts,
  conflictType: 'Workshop Session',
  errorMessage:
    'This advisor is currently scheduled for a workshop session at this time',
})

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
  conflictType: string

  @Field()
  errorMessage: string

  @Field(() => [TimeConflict])
  timeConflicts: TimeConflict[]
}
