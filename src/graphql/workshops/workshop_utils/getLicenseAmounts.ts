import { LICENSE_TYPE } from '../../enums/LICENSE_TYPE'
import { PrismaClient, workshops } from '@prisma/client'
import { CustomError } from 'src/middleware/errorHandler'

const getLicenseAmountsByCompletedStatus =
  (checkForCompletedWorkshop: boolean) => (workshops: workshops[]) => {
    return workshops.reduce((total, workshop) => {
      const validCompletedWorkshop =
        checkForCompletedWorkshop && workshop.workshop_status === 'COMPLETED'
      const validIncompleteWorkshop =
        !checkForCompletedWorkshop && workshop.workshop_status !== 'COMPLETED'
      if (validCompletedWorkshop || validIncompleteWorkshop) {
        if (workshop.license_type === 'FULL_WORKSHOP') {
          return (total += 1)
        } else {
          return (total += workshop.class_size)
        }
      } else {
        return total
      }
    }, 0)
  }

const getCompletedLicenseAmounts = getLicenseAmountsByCompletedStatus(true)
const getReservedLicenseAmounts = getLicenseAmountsByCompletedStatus(false)

export const getLicenseAmounts = async (config: {
  client_id: number
  course_id: number
  license_type: LICENSE_TYPE
  prisma: PrismaClient
}) => {
  const { client_id, course_id, license_type, prisma } = config
  const workshopsAndLicenses = await prisma.clients.findFirst({
    where: { client_id },
    include: {
      workshops: {
        where: {
          course_id,
          license_type,
          NOT: { OR: [{ deleted: true }, { workshop_status: 'CANCELLED' }] },
        },
      },
      licenses: { where: { course_id, license_type } },
    },
  })

  if (!workshopsAndLicenses) {
    throw new CustomError('No such client found!')
  }

  const { workshops, licenses } = workshopsAndLicenses

  const totalLicenses = licenses[0].license_amount
  const completedLicenses = getCompletedLicenseAmounts(workshops)
  const reservedLicenses = getReservedLicenseAmounts(workshops)
  const availableLicenses =
    totalLicenses - (completedLicenses + reservedLicenses)

  if (availableLicenses < 0) {
    throw Error(
      `When checking for license totals for client ${client_id}, available licenses were found to be below 0`
    )
  }

  return {
    totalLicenses,
    completedLicenses,
    reservedLicenses,
    availableLicenses,
  }
}
