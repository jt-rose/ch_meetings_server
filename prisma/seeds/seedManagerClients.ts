import { PrismaClient } from '@prisma/client'

// seed manager client relations into database
export const seedManagerClients = async (prisma: PrismaClient) => {
  const managerClientRelationships = await prisma.manager_clients.createMany({
    data: [
      // manager 1
      {
        //manager_client_id: 1,
        manager_id: 1,
        client_id: 1,
      },
      {
        //manager_client_id: 4,
        manager_id: 1,
        client_id: 3,
      },
      {
        //manager_client_id: 8,
        manager_id: 1,
        client_id: 5,
      },
      //manager 2
      {
        //manager_client_id: 2,
        manager_id: 2,
        client_id: 1,
      },
      {
        //manager_client_id: 6,
        manager_id: 2,
        client_id: 4,
      },
      {
        //manager_client_id: 7,
        manager_id: 2,
        client_id: 5,
      },
      // manager 3
      {
        //manager_client_id: 3,
        manager_id: 3,
        client_id: 3,
      },
      {
        //manager_client_id: 5,
        manager_id: 3,
        client_id: 4,
      },
    ],
  })

  if (managerClientRelationships.count !== 8) {
    console.log(`Manager client relationships seeded into database: false`)
  }
}
