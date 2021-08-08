import { PrismaClient } from '@prisma/client'

export const confirmAvailableLicenses = async (config: {
  prisma: PrismaClient
  client_id: number
  course_id: number
  class_size: number
}) => {
  const { prisma, client_id, course_id, class_size } = config
  const clientWithLicenses = await prisma.clients.findFirst({
    where: { client_id },
    include: {
      available_licenses: { where: { course_id } },
    },
  })

  if (!clientWithLicenses) throw Error('No such client found!')
  if (!clientWithLicenses.active) throw Error('Client is currently inactive!')

  const updatedAvailableLicenseAmount =
    clientWithLicenses.available_licenses[0].remaining_amount - class_size
  if (updatedAvailableLicenseAmount < 0)
    throw Error('Not enough licenses for this course!')
  return {
    clientWithLicenses,
    updatedAvailableLicenseAmount,
  }
}
