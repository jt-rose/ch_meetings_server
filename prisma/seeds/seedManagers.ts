import { PrismaClient } from '@prisma/client'

// seed managers and manager assignments into database
export const seedManagers = async (prisma: PrismaClient) => {
  const manager1 = await prisma.managers.create({
    data: {
      first_name: 'Amy',
      last_name: 'Firenzi',
      email: 'amy.firenzi@company.net',
      email_password: 'password123',
      // these passwords are just for the mock data
      // real passwords will have character requirements + hashing
      manager_assignments: {
        createMany: {
          data: [
            { assignment_id: 1, workshop_id: 1, active: true },
            { assignment_id: 2, workshop_id: 2, active: true },
            { assignment_id: 3, workshop_id: 3, active: false },
            { assignment_id: 4, workshop_id: 4, active: false },
            { assignment_id: 5, workshop_id: 6, active: true },
          ],
        },
      },
    },
  })

  const manager2 = await prisma.managers.create({
    data: {
      first_name: 'Frank',
      last_name: 'Low',
      email: 'frank.low@company.net',
      email_password: 'myunhashedpassword',
      manager_assignments: {
        createMany: {
          data: [
            { assignment_id: 6, workshop_id: 1, active: true },
            { assignment_id: 7, workshop_id: 2, active: true },
            { assignment_id: 8, workshop_id: 3, active: true },
            { assignment_id: 9, workshop_id: 5, active: true },
            { assignment_id: 10, workshop_id: 6, active: true },
          ],
        },
      },
    },
  })

  const manager3 = await prisma.managers.create({
    data: {
      first_name: 'Gina',
      last_name: 'Haskell',
      email: 'gina.haskell@company.net',
      email_password: 'noonewillguess12345',
      manager_assignments: {
        createMany: {
          data: [
            { assignment_id: 11, workshop_id: 4, active: true },
            { assignment_id: 12, workshop_id: 5, active: true },
            { assignment_id: 13, workshop_id: 6, active: false },
          ],
        },
      },
    },
  })

  const managers = [manager1, manager2, manager3]
  const allManagersSeeded = managers.every((x) => x)
  if (!allManagersSeeded) {
    console.log(`Managers seeded into database: false`)
  }
}
