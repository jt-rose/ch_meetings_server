import { PrismaClient } from '@prisma/client'
import { seedCourses } from './seeds/seedCourses'
import { seedClients } from './seeds/seedClients'
import { seedAdvisors } from './seeds/seedAdvisors'
import { seedWorkshops } from './seeds/seedWorkshops'
import { seedManagers } from './seeds/seedManagers'

async function main(prisma: PrismaClient) {
  await seedCourses(prisma)
  await seedClients(prisma)
  await seedAdvisors(prisma)
  await seedWorkshops(prisma)
  await seedManagers(prisma)

  console.log('all database seeding complete')
}

const prisma = new PrismaClient()
main(prisma)
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
