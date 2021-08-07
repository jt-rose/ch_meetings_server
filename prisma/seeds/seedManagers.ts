import { PrismaClient } from '@prisma/client'
import argon2 from 'argon2'

// seed managers into database
export const seedManagers = async (prisma: PrismaClient) => {
  const manager1 = await prisma.managers.create({
    data: {
      //manager_id: 1,
      first_name: 'Amy',
      last_name: 'Firenzi',
      email: 'amy.firenzi@company.net',
      email_password: await argon2.hash('Password123!'),
      // these passwords are just for the mock data
      // real passwords will have character requirements + hashing
      user_type: 'ADMIN',
    },
  })

  const manager2 = await prisma.managers.create({
    data: {
      //manager_id: 2,
      first_name: 'Frank',
      last_name: 'Low',
      email: 'frank.low@company.net',
      email_password: await argon2.hash('My@Password789'),
      user_type: 'USER',
    },
  })

  const manager3 = await prisma.managers.create({
    data: {
      //manager_id: 3,
      first_name: 'Gina',
      last_name: 'Haskell',
      email: 'gina.haskell@company.net',
      email_password: await argon2.hash('NoOneWillGuess12345!'),
      user_type: 'USER',
    },
  })

  const coordinator = await prisma.managers.create({
    data: {
      //manager_id: 4,
      first_name: 'Ezra',
      last_name: 'Metz',
      email: 'ezra.metz@company.net',
      email_password: await argon2.hash('SuperSecret12345!'),
      user_type: 'COORDINATOR',
    },
  })

  const CEO = await prisma.managers.create({
    data: {
      //manager_id: 5,
      first_name: 'Luna',
      last_name: 'Renzi',
      email: 'luna.renzi@company.net',
      email_password: await argon2.hash('MyPasswordIsPassword12345!'),
      user_type: 'SUPERADMIN',
    },
  })

  const managers = [manager1, manager2, manager3, coordinator, CEO]
  const allManagersSeeded = managers.every((x) => x)
  if (!allManagersSeeded) {
    console.log(`Managers seeded into database: false`)
  }
}
