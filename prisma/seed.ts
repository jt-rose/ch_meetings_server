import { PrismaClient } from '@prisma/client'
import { seedCourses } from './seeds/seedCourses'
import { seedClients } from './seeds/seedClients'
import { seedAdvisors } from './seeds/seedAdvisors'
import { seedWorkshops } from './seeds/seedWorkshops'
import { seedManagers } from './seeds/seedManagers'

// run all prisma seeding
// some tables are set up with PK / FK constraints
// so the order here matters
async function main(prisma: PrismaClient) {
  await seedCourses(prisma)
  await seedClients(prisma)
  await seedAdvisors(prisma)
  await seedWorkshops(prisma)
  await seedManagers(prisma)

  console.log('all database seeding complete')
}

// generate new prisma client, run db seeding, then disconnect
const prisma = new PrismaClient()
main(prisma)
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
