import { PrismaClient } from '@prisma/client'

// seed manager assignments into database
export const seedManagerAssignments = async (prisma: PrismaClient) => {
  const managerAssignments = await prisma.manager_assignments.createMany({
    data: [
      // manager 1
      {
        //assignment_id: 1,
        manager_id: 1,
        workshop_id: 1,
        active: true,
      },
      {
        //assignment_id: 2,
        manager_id: 1,
        workshop_id: 2,
        active: true,
      },
      {
        //assignment_id: 3,
        manager_id: 1,
        workshop_id: 3,
        active: false,
      },
      {
        //assignment_id: 4,
        manager_id: 1,
        workshop_id: 4,
        active: false,
      },
      {
        //assignment_id: 5,
        manager_id: 1,
        workshop_id: 6,
        active: true,
      },
      //assignment_id: 6,
      { workshop_id: 7, manager_id: 1, active: false },
      // manager 2
      {
        //assignment_id: 7,
        manager_id: 2,
        workshop_id: 1,
        active: true,
      },
      {
        //assignment_id: 8,
        manager_id: 2,
        workshop_id: 2,
        active: true,
      },
      {
        //assignment_id: 9,
        manager_id: 2,
        workshop_id: 3,
        active: true,
      },
      {
        //assignment_id: 10,
        manager_id: 2,
        workshop_id: 5,
        active: true,
      },
      {
        //assignment_id: 11,
        manager_id: 2,
        workshop_id: 6,
        active: true,
      },
      // manager 3
      {
        //assignment_id: 12,
        manager_id: 3,
        workshop_id: 4,
        active: true,
      },
      {
        //assignment_id: 13,
        manager_id: 3,
        workshop_id: 5,
        active: true,
      },
      {
        //assignment_id: 14,
        manager_id: 3,
        workshop_id: 6,
        active: false,
      },
    ],
  })

  if (managerAssignments.count !== 14) {
    console.log(`Manager Assignments seeded into database: false`)
  }
}
