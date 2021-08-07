import { PrismaClient } from '@prisma/client'

// seeds the database with advisors and relational data
// for each advisor's language, regions, and unavailable days
export const seedAdvisors = async (prisma: PrismaClient) => {
  const advisor1 = await prisma.advisors.create({
    data: {
      //advisor_id: 1,
      email: 'john.doe@email.com',
      first_name: 'John',
      last_name: 'Doe',
      languages: {
        create: {
          // language_id: 1,
          advisor_language: 'English',
        },
      },
      regions: {
        create: {
          // region_id: 1,
          advisor_region: 'NAM',
        },
      },
      advisor_notes: {
        create: [
          {
            // note_id: 1,
            advisor_note:
              'Can travel to EMEA occasionally with 3+ months notice',
            created_by: 3,
          },
          {
            // note_id: 2,
            advisor_note:
              'Has partnered with Henri in developing training materials for EMEA cohorts',
            created_by: 1,
          },
        ],
      },
      advisor_unavailable_times: {
        createMany: {
          data: [
            {
              // unavailable_id: 1,
              unavailable_start_time: new Date('2021-10-22T01:00:00Z'),
              unavailable_end_time: new Date('2021-10-25T01:00:00Z'),
              note: 'On Vacation',
            },
          ],
        },
      },
    },
  })

  const advisor2 = await prisma.advisors.create({
    data: {
      // advisor_id: 2,
      email: 'henri@email.net',
      first_name: 'Henri',
      last_name: 'Bonaparte',
      languages: {
        createMany: {
          data: [
            {
              // language_id: 2,
              advisor_language: 'English',
            },
            {
              // language_id: 3,
              advisor_language: 'French',
            },
          ],
        },
      },
      regions: {
        createMany: {
          data: [
            {
              // region_id: 2,
              advisor_region: 'EMEA',
            },
            {
              // region_id: 3,
              advisor_region: 'NAM',
            },
          ],
        },
      },
      advisor_unavailable_times: {
        createMany: {
          data: [
            {
              // unavailable_id: 2,
              unavailable_start_time: new Date('2021-06-22T01:00:00Z'),
              unavailable_end_time: new Date('2021-06-22T23:59:59Z'),
            },
            {
              // unavailable_id: 3,
              unavailable_start_time: new Date('2021-12-25T01:00:00Z'),
              unavailable_end_time: new Date('2021-12-25T23:59:59Z'),
            },
          ],
        },
      },
    },
  })

  const advisor3 = await prisma.advisors.create({
    data: {
      // advisor_id: 3,
      email: 'yusuke@tokyo.co.jp',
      first_name: 'Yusuke',
      last_name: 'Suzumura',
      languages: {
        createMany: {
          data: [
            {
              //language_id: 4,
              advisor_language: 'Japanese',
            },
            {
              //language_id: 5,
              advisor_language: 'Chinese',
            },
          ],
        },
      },
      regions: {
        createMany: {
          data: [
            {
              //region_id: 4,
              advisor_region: 'APAC',
            },
            {
              //region_id: 5,
              advisor_region: 'NAM',
            },
          ],
        },
      },
      advisor_unavailable_times: {
        create: {
          //unavailable_id: 7,
          unavailable_start_time: new Date('2021-11-30T01:00:00Z'),
          unavailable_end_time: new Date('2021-11-30T23:59:59Z'),
          note: 'May be unavailable - best to avoid this date',
        },
      },
    },
  })

  const advisor4 = await prisma.advisors.create({
    data: {
      //advisor_id: 4,
      email: 'jorge@advisor.net',
      first_name: 'Jorge',
      last_name: 'Esteban',
      languages: {
        create: {
          //language_id: 6,
          advisor_language: 'Spanish',
        },
      },
      regions: {
        create: {
          //region_id: 6,
          advisor_region: 'LATAM',
        },
      },
    },
  })

  const advisor5 = await prisma.advisors.create({
    data: {
      //advisor_id: 5,
      email: 'nathan.jameson@email.com',
      first_name: 'Nathan',
      last_name: 'Jameson',
      languages: {
        create: [
          {
            //language_id: 7,
            advisor_language: 'English',
          },
          {
            //language_id: 8,
            advisor_language: 'Vietnamese',
          },
        ],
      },
      regions: {
        create: [
          {
            //region_id: 7,
            advisor_region: 'NAM',
          },
          {
            //region_id: 8,
            advisor_region: 'APAC',
          },
        ],
      },
      advisor_notes: {
        create: {
          //note_id: 3,
          advisor_note: 'Regularly travels between US, Japan, and Vietnam',

          created_by: 1,
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
