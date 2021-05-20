import { PrismaClient } from '@prisma/client'

// seeds the database with advisors and relational data
// for each advisor's language, regions, and unavailable days
export const seedAdvisors = async (prisma: PrismaClient) => {
  const advisor1 = await prisma.advisors.create({
    data: {
      email: 'john.doe@email.com',
      first_name: 'John',
      last_name: 'Doe',
      languages: { create: { advisor_language: 'English' } },
      regions: { create: { advisor_region: 'North America' } },
      unavailable_days: {
        createMany: {
          data: [
            { day_unavailable: '2021-10-22T01:00:00Z', note: 'On Vacation' },
            { day_unavailable: '2021-10-23T01:00:00Z', note: 'On Vacation' },
            { day_unavailable: '2021-10-24T01:00:00Z', note: 'On Vacation' },
            { day_unavailable: '2021-10-25T01:00:00Z', note: 'On Vacation' },
          ],
        },
      },
    },
  })

  const advisor2 = await prisma.advisors.create({
    data: {
      email: 'henri@email.net',
      first_name: 'Henri',
      last_name: 'Bonaparte',
      languages: {
        createMany: {
          data: [
            { advisor_language: 'English' },
            { advisor_language: 'French' },
          ],
        },
      },
      regions: {
        createMany: {
          data: [{ advisor_region: 'EMEA' }, { advisor_region: 'Africa' }],
        },
      },
      unavailable_days: {
        createMany: {
          data: [
            { day_unavailable: '2021-06-22T01:00:00Z' },
            { day_unavailable: '2021-12-25T01:00:00Z' },
          ],
        },
      },
    },
  })

  const advisor3 = await prisma.advisors.create({
    data: {
      email: 'yusuke@tokyo.co.jp',
      first_name: 'Yusuke',
      last_name: 'Suzumura',
      languages: {
        createMany: {
          data: [
            { advisor_language: 'Japanese' },
            { advisor_language: 'Chinese' },
          ],
        },
      },
      regions: {
        createMany: {
          data: [
            { advisor_region: 'APAC' },
            { advisor_region: 'North America' },
          ],
        },
      },
      unavailable_days: {
        create: {
          day_unavailable: '2021-11-30T01:00:00Z',
          note: 'May be unavailable - best to avoid this date',
        },
      },
    },
  })

  const advisor4 = await prisma.advisors.create({
    data: {
      email: 'jorge@advisor.net',
      first_name: 'Jorge',
      last_name: 'Esteban',
      languages: { create: { advisor_language: 'Spanish' } },
      regions: { create: { advisor_region: 'South America' } },
    },
  })

  const advisors = [advisor1, advisor2, advisor3, advisor4]
  console.log(`Seeded the following advisors:
  ${advisor1.email}
  ${advisor2.email}
  ${advisor3.email}
  ${advisor4.email}`)
}
