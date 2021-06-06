import { PrismaClient } from '@prisma/client'

// seeds the database with advisors and relational data
// for each advisor's language, regions, and unavailable days
export const seedAdvisors = async (prisma: PrismaClient) => {
  const advisor1 = await prisma.advisors.create({
    data: {
      advisor_id: 1,
      email: 'john.doe@email.com',
      first_name: 'John',
      last_name: 'Doe',
      languages: { create: { language_id: 1, advisor_language: 'English' } },
      regions: { create: { region_id: 1, advisor_region: 'NAM' } },
      advisor_notes: {
        create: [
          {
            note_id: 1,
            advisor_note:
              'Can travel to EMEA occasionally with 3+ months notice',
          },
          {
            note_id: 2,
            advisor_note:
              'Has partnered with Henri in developing training materials for EMEA cohorts',
          },
        ],
      },
      unavailable_days: {
        createMany: {
          data: [
            {
              unavailable_id: 1,
              day_unavailable: new Date('2021-10-22T01:00:00Z'),
              note: 'On Vacation',
            },
            {
              unavailable_id: 2,
              day_unavailable: new Date('2021-10-23T01:00:00Z'),
              note: 'On Vacation',
            },
            {
              unavailable_id: 3,
              day_unavailable: new Date('2021-10-24T01:00:00Z'),
              note: 'On Vacation',
            },
            {
              unavailable_id: 4,
              day_unavailable: new Date('2021-10-25T01:00:00Z'),
              note: 'On Vacation',
            },
          ],
        },
      },
    },
  })

  const advisor2 = await prisma.advisors.create({
    data: {
      advisor_id: 2,
      email: 'henri@email.net',
      first_name: 'Henri',
      last_name: 'Bonaparte',
      languages: {
        createMany: {
          data: [
            { language_id: 2, advisor_language: 'English' },
            { language_id: 3, advisor_language: 'French' },
          ],
        },
      },
      regions: {
        createMany: {
          data: [
            { region_id: 2, advisor_region: 'EMEA' },
            { region_id: 3, advisor_region: 'NAM' },
          ],
        },
      },
      unavailable_days: {
        createMany: {
          data: [
            {
              unavailable_id: 5,
              day_unavailable: new Date('2021-06-22T01:00:00Z'),
            },
            {
              unavailable_id: 6,
              day_unavailable: new Date('2021-12-25T01:00:00Z'),
            },
          ],
        },
      },
    },
  })

  const advisor3 = await prisma.advisors.create({
    data: {
      advisor_id: 3,
      email: 'yusuke@tokyo.co.jp',
      first_name: 'Yusuke',
      last_name: 'Suzumura',
      languages: {
        createMany: {
          data: [
            { language_id: 4, advisor_language: 'Japanese' },
            { language_id: 5, advisor_language: 'Chinese' },
          ],
        },
      },
      regions: {
        createMany: {
          data: [
            { region_id: 4, advisor_region: 'APAC' },
            { region_id: 5, advisor_region: 'NAM' },
          ],
        },
      },
      unavailable_days: {
        create: {
          unavailable_id: 7,
          day_unavailable: new Date('2021-11-30T01:00:00Z'),
          note: 'May be unavailable - best to avoid this date',
        },
      },
    },
  })

  const advisor4 = await prisma.advisors.create({
    data: {
      advisor_id: 4,
      email: 'jorge@advisor.net',
      first_name: 'Jorge',
      last_name: 'Esteban',
      languages: { create: { language_id: 6, advisor_language: 'Spanish' } },
      regions: { create: { region_id: 6, advisor_region: 'LATAM' } },
    },
  })

  const advisor5 = await prisma.advisors.create({
    data: {
      advisor_id: 5,
      email: 'nathan.jameson@email.com',
      first_name: 'Nathan',
      last_name: 'Jameson',
      languages: {
        create: [
          { language_id: 7, advisor_language: 'English' },
          { language_id: 8, advisor_language: 'Vietnamese' },
        ],
      },
      regions: {
        create: [
          { region_id: 7, advisor_region: 'NAM' },
          { region_id: 8, advisor_region: 'APAC' },
        ],
      },
      advisor_notes: {
        create: {
          note_id: 3,
          advisor_note: 'Regularly travels between US, Japan, and Vietnam',
        },
      },
    },
  })

  const advisors = [advisor1, advisor2, advisor3, advisor4, advisor5]
  const allAdvisorsSeeded = advisors.every((x) => x)
  if (!allAdvisorsSeeded) {
    console.log(`All advisors seeded: false`)
  }
}
