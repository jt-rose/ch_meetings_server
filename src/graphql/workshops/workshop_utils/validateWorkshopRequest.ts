import { PrismaClient } from '@prisma/client'
import { hasTimeConflict } from './checkTimeConflicts'
import { rejectInactiveAdvisor } from './confirmActiveAdvisor'
import { confirmAvailableLicenses } from './confirmLicenses'
import { CreateSessionInput } from './SessionInput'
import { CreateWorkshopInput, EditWorkshopInput } from './workshopInput'

// validates a new or edited workshop request
// checking for active advisors, active clients
// and for possible time conflicts
export const validateWorkshopRequest = async (config: {
  workshopDetails: CreateWorkshopInput | EditWorkshopInput
  sessionDetails: CreateSessionInput[]
  client_id: number
  prisma: PrismaClient
}) => {
  const { workshopDetails, sessionDetails, client_id, prisma } = config

  /* --------- ignore validation if workshop request will be cancelled -------- */
  if (
    'workshop_status' in workshopDetails &&
    workshopDetails.workshop_status === 'CANCELLED'
  )
    return 'CANCELLED - NO VALIDATION NEEDED'

  // determine whether to validate assigned advisor, requested advisor, or null
  const assigned_advisor_id =
    'assigned_advisor_id' in workshopDetails
      ? workshopDetails.assigned_advisor_id
      : null
  const targetAdvisor =
    assigned_advisor_id || workshopDetails.requested_advisor_id

  /* ----------------------- reject if inactive advisor ----------------------- */

  if (targetAdvisor) {
    await rejectInactiveAdvisor(targetAdvisor, prisma)
  }

  /* ------------- check for active client and sufficient licenses ------------ */
  // check against reserved licenses if editing
  const { clientWithLicenses, updatedAvailableLicenseAmount } =
    await confirmAvailableLicenses({
      prisma,
      client_id,
      course_id: workshopDetails.course_id,
      class_size: workshopDetails.class_size,
    })

  /* --------------- if requested advisor check for availability -------------- */
  if (targetAdvisor) {
    const timeConflict = await hasTimeConflict({
      prisma,
      advisor_id: targetAdvisor,
      requests: sessionDetails.map((session) => ({
        requestedStartTime: session.start_time,
        requestedEndTime: session.end_time,
      })),
    })

    if (timeConflict) return timeConflict
  }

  // if no issues found, return license info found
  // for use in other functions
  return { clientWithLicenses, updatedAvailableLicenseAmount }
}
