// specify the string argument should be in ISO form
type ISOString = string

// check if requested session has conflict with an already scheduled session
// this will also show conflicts if one session ends right as another begins
// ex: one ends at 11 AM and another starts at 11 AM
// since this does not give the advisor adequate time to prepare
// and workshops may go slightly over (and then impacting the next one)
// this behavior is intended
export const hasTimeConflict = (sessionTimes: {
  requestedStartTime: ISOString
  requestedEndTime: ISOString
  scheduledStartTime: ISOString
  scheduledEndTime: ISOString
}) => {
  const {
    requestedStartTime,
    requestedEndTime,
    scheduledStartTime,
    scheduledEndTime,
  } = sessionTimes

  // check if requested start time is between scheduled start and end times
  // avoiding sessions that have started and ended before the request
  if (
    requestedStartTime >= scheduledStartTime &&
    requestedStartTime <= scheduledEndTime
  ) {
    return true
  }

  // check if requested end time falls between scheduled start and end times
  // this will also catch conflicts where the requested session
  // starts before and ends after the scheduled session
  if (
    requestedStartTime <= scheduledStartTime &&
    requestedEndTime >= scheduledStartTime
  ) {
    return true
  }
  // confirm no conflict
  return false
}
