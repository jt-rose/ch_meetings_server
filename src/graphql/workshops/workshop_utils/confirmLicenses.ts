import { PrismaClient } from '@prisma/client'
import { LICENSE_TYPE } from '../../enums/LICENSE_TYPE'
import { CustomError } from '../../../middleware/errorHandler'

// ! add check for workshop type
// ! block adding same type twice

export const confirmAvailableLicenses = async (config: {
  prisma: PrismaClient
  client_id: number
  course_id: number
  class_size: number
  license_type: LICENSE_TYPE
  workshop_id?: number // for editing a workshop request
}) => {
  const {
    prisma,
    client_id,
    course_id,
    class_size,
    license_type,
    workshop_id,
  } = config

  // find available and reserved licenses of client
  const clientWithLicenses = await prisma.clients.findFirst({
    where: { client_id },
    include: {
      available_licenses: {
        where: { course_id, license_type },
        // the reserved license count will be pulled if a workshop id is provided
        // this is used when editing a reserved amount
        // but will default to 0 when checking against a new request
        // by cross referencing the workshop id and the course id
        // this will also work when requesting a change of workshop course
        include: { reserved_licenses: { where: { workshop_id: workshop_id } } },
      },
    },
  })

  // reject if client not found or inactive
  if (!clientWithLicenses) throw new CustomError('No such client found!')
  if (!clientWithLicenses.active)
    throw new CustomError('Client is currently inactive!')

  // get reserved and remaining amounts, default to 0 when not found
  const currentAmountOfReservedLicenses =
    clientWithLicenses.available_licenses[0].reserved_licenses[0]
      .reserved_amount || 0
  const currentAmountOfAvailableLicenses =
    clientWithLicenses.available_licenses[0].remaining_amount || 0

  // throw error if license_type is full workshop but reserved amount for this workshop is greater than one
  // this error will be hidden from the user but stored in the error log
  if (license_type === 'FULL_WORKSHOP' && currentAmountOfReservedLicenses > 1) {
    throw Error(
      `Full workshop licenses should only have one workshop reservation per workshop reservation id, but workshop #${workshop_id} had ${currentAmountOfReservedLicenses} reservations associated with it`
    )
  }

  // map number of licenses needed based on whether the license_type is for individuals or a full_workshop
  const numberOfLicensesNeeded =
    license_type === 'FULL_WORKSHOP' ? 1 : class_size

  // determine remaining licenses after removing amount of licenses needed
  const updatedAvailableLicenseAmount =
    currentAmountOfReservedLicenses +
    currentAmountOfAvailableLicenses -
    numberOfLicensesNeeded

  // reject if too few licenses to accomodate class
  if (updatedAvailableLicenseAmount < 0)
    throw new CustomError('Not enough licenses for this course!')

  // return data fields for use in other functions
  return {
    clientWithLicenses,
    updatedAvailableLicenseAmount,
  }
}
