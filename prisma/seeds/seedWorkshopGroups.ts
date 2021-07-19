import { PrismaClient } from '@prisma/client'

// seed managers into database
export const seedWorkshopGroups = async (prisma: PrismaClient) => {
  await prisma.workshop_groups.create({
    data: {
      created_by: 2,

      group_name: 'Acme Cohorts 2020-2021',
      workshop_group_notes: {
        create: {
          created_by: 2,
          note: 'Group of Cohorts using V2 training materials',
        },
      },
    },
  })
}
