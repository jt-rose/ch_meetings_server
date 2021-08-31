import { PrismaClient } from '@prisma/client'
import { CustomError } from 'src/middleware/errorHandler'

export const confirmAvailableLicenses = async (config: {
  prisma: PrismaClient
  client_id: number
  course_id: number
  class_size: number
  workshop_id?: number // for editing a workshop request
}) => {
  const { prisma, client_id, course_id, class_size, workshop_id } = config

  // find available and reserved licenses of client
  const clientWithLicenses = await prisma.clients.findFirst({
    where: { client_id },
    include: {
      available_licenses: {
        where: { course_id },
        include: { reserved_licenses: { where: { workshop_id: workshop_id } } },
      },
    },
  })

  // reject if client not found or inactive
  if (!clientWithLicenses) throw new CustomError('No such client found!')
  if (!clientWithLicenses.active)
    throw new CustomError('Client is currently inactive!')

  // get reserved and remaining amounts, default to 0 when not found
  const { reserved_amount } =
    clientWithLicenses.available_licenses[0].reserved_licenses[0] || 0
  const { remaining_amount } = clientWithLicenses.available_licenses[0] || 0

  // determine remaining licenses after removing class size
  const updatedAvailableLicenseAmount =
    reserved_amount + remaining_amount - class_size

  // reject if too few licenses to accomodate class
  if (updatedAvailableLicenseAmount < 0)
    throw new CustomError('Not enough licenses for this course!')

  // return data fields for use in other functions
  return {
    clientWithLicenses,
    updatedAvailableLicenseAmount,
  }
}
