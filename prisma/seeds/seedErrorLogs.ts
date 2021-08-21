import { PrismaClient } from '@prisma/client'

// seeds the database with advisors and relational data
// for each advisor's language, regions, and unavailable days
export const seedErrorLogs = async (prisma: PrismaClient) => {
  const errorLogs = await prisma.error_log.createMany({
    data: [
      {
        error_time: new Date('10 22 2015'),
        error_response: 'Sample error log 1',
        manager_id: 1,
      },
      {
        error_time: new Date('8 31 2016'),
        error_response: 'Sample error log 2',
        manager_id: 1,
      },
      {
        error_time: new Date('9 14 2017'),
        error_response: 'Sample error log 3',
        manager_id: 1,
      },
      {
        error_time: new Date('10 3 2020'),
        error_response: 'Sample error log 4',
        manager_id: 2,
      },
      {
        error_time: new Date('4 26 2021'),
        error_response: 'Sample error log 5',
        manager_id: 3,
      },
    ],
  })

  if (errorLogs.count !== 5) {
    console.log('Seed Error Logs: Failed')
  }
}
