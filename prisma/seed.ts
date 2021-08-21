import { prisma } from '../src/prisma'
import { seedCourses } from './seeds/seedCourses'
import { seedClients } from './seeds/seedClients'
import { seedAdvisors } from './seeds/seedAdvisors'
import { seedWorkshops } from './seeds/seedWorkshops'
import { seedManagers } from './seeds/seedManagers'
import { seedManagerAssignments } from './seeds/seedManagerAssignments'
import { seedManagerClients } from './seeds/seedManagerClients'
import { seedLicenses } from './seeds/seedLicenses'
import { seedErrorLogs } from './seeds/seedErrorLogs'

// run all prisma seeding
// some tables are set up with PK / FK constraints
// so the order here matters
export async function seed() {
  await seedManagers(prisma)
  await seedCourses(prisma)
  await seedClients(prisma)
  await seedManagerClients(prisma)
  await seedAdvisors(prisma)
  await seedWorkshops(prisma)
  await seedManagerAssignments(prisma)
  await seedLicenses(prisma)
  await seedErrorLogs(prisma)
}
