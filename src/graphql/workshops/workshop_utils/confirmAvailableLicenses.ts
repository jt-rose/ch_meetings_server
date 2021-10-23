import { getLicenseAmounts } from './getLicenseAmounts'
import { PrismaClient } from '@prisma/client'
import { LICENSE_TYPE } from '../../enums/LICENSE_TYPE'
import { CustomError } from '../../../middleware/errorHandler'

// confirm client has enough licenses to cover the current request
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

  if (class_size < 1)
    throw new CustomError(
      'Must have at least one person attending the workshop!'
    )
  // find available and reserved licenses of client
  const clientWithLicenses = await prisma.clients.findFirst({
    where: { client_id },
    include: {
      workshops: { where: { workshop_id } },
      licenses: {
        where: { course_id, license_type },
        // the reserved license count will be pulled if a workshop id is provided
        // this is used when editing a reserved amount
        // but will default to 0 when checking against a new request
        // by cross referencing the workshop id and the course id
        // this will also work when requesting a change of workshop course
      },
    },
  })

  // reject if client not found or inactive
  if (!clientWithLicenses) throw new CustomError('No such client found!')
  if (!clientWithLicenses.active)
    throw new CustomError('Client is currently inactive!')
  const workshop = clientWithLicenses.workshops[0]
  if (workshop_id && !workshop)
    throw new CustomError(
      `Specified workshop ID #${workshop_id} could not be found!`
    )
  if (license_type !== workshop.license_type)
    throw new CustomError(
      `The requested license changes must be for the same type of license!`
    )

  const licenses = clientWithLicenses.licenses[0]
  if (!licenses) throw new CustomError('No licenses for this workshop found!')

  // map number of licenses needed based on whether the license_type is for individuals or a full_workshop
  const getNumberOfLicensesNeeded = () => {
    // if the license type is for a full workshop that is already scheduled
    // no additional licenses are needed
    // otherwise a single new license for the full workshop will be needed
    if (license_type === 'FULL_WORKSHOP') {
      return workshop_id ? 0 : 1
    } else {
      // if the license type is for individual participants and the workshop has already
      // been requested, then all we need is to calculate the different amount
      // of licenses needed, i.e., 5 additional licenses
      // if this is for a brand new workshop request
      // then we will need the full class size
      return workshop_id
        ? class_size - clientWithLicenses.workshops[0].class_size
        : class_size
    }
  }
  const numberOfLicensesNeeded = getNumberOfLicensesNeeded()

  // get currently available licenses
  const { availableLicenses } = await getLicenseAmounts({
    client_id,
    course_id,
    license_type,
    prisma,
  })

  // reject if too few licenses to accomodate class / class size change
  if (numberOfLicensesNeeded > availableLicenses)
    throw new CustomError(
      `Not enough licenses for this ${
        license_type === 'FULL_WORKSHOP' ? 'course' : 'class size'
      }!`
    )

  // return data fields for use in other functions
  return clientWithLicenses
}
