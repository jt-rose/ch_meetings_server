import { PrismaClient } from '@prisma/client'

// reject if advisor is not active or not found
export const rejectInactiveAdvisor = async (
  advisor_id: number,
  prisma: PrismaClient
) => {
  const advisorAvailability = await prisma.advisors.findFirst({
    where: { advisor_id },
  })
  if (!advisorAvailability) throw Error('No such advisor found!')
  if (!advisorAvailability.active)
    throw Error('Advisor is not currently active!')
}
