import { PrismaClient } from '@prisma/client'
import { DateTime } from 'luxon'

interface SameDaySession {
  start_time: Date
  end_time: Date
  workshop_id: number
  assigned_advisor_id: number
}

// check if requested session has conflict with an already scheduled session
// this will also show conflicts if one session ends right as another begins
// ex: one ends at 11 AM and another starts at 11 AM
// since this does not give the advisor adequate time to prepare
// and workshops may go slightly over (and then impacting the next one)
// this behavior is intended
export const hasTimeConflict = async (config: {
  advisor_id: number
  requestedStartTime: Date
  requestedEndTime: Date
  prisma: PrismaClient
}) => {
  const { advisor_id, requestedStartTime, requestedEndTime, prisma } = config

  // reformat date without time
  const dateWithoutTime = DateTime.fromJSDate(requestedStartTime).toISODate()

  // check for other sessions scheduled to the same advisor and for the same date
  const sameDaySessions = await prisma.$queryRaw<SameDaySession[]>`
    SELECT ws.start_time, ws.end_time, ws.workshop_id, workshops.assigned_advisor_id
    FROM workshop_sessions as ws
    JOIN workshops ON ws.workshop_id = workshops.workshop_id
    WHERE workshops.assigned_advisor_id = ${advisor_id}
	AND DATE(ws.start_time) = ${dateWithoutTime}
    `

  console.log(sameDaySessions)

  const timeConflicts = sameDaySessions.filter((session) => {
    // check if requested start time is between scheduled start and end times
    // avoiding sessions that have started and ended before the request
    if (
      requestedStartTime >= session.start_time &&
      requestedStartTime <= session.end_time
    ) {
      return session
    }

    // check if requested end time falls between scheduled start and end times
    // this will also catch conflicts where the requested session
    // starts before and ends after the scheduled session
    if (
      requestedStartTime <= session.start_time &&
      requestedEndTime >= session.start_time
    ) {
      return session
    }
    // confirm no conflict
    return false
  })

  return timeConflicts
}
