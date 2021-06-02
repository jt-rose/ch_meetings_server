import { prisma } from '../src/prisma'
import { seedCourses } from './seeds/seedCourses'
import { seedClients } from './seeds/seedClients'
import { seedAdvisors } from './seeds/seedAdvisors'
import { seedWorkshops } from './seeds/seedWorkshops'
import { seedManagers } from './seeds/seedManagers'

// run all prisma seeding
// some tables are set up with PK / FK constraints
// so the order here matters
export async function seed() {
  try {
    await seedCourses(prisma)
    await seedClients(prisma)
    await seedAdvisors(prisma)
    await seedWorkshops(prisma)
    await seedManagers(prisma)
  } catch (e) {
    console.log('Error: Seeding not completed ')
  }
}

/*
seed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
*/
