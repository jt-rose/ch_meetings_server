import { PrismaClient } from '@prisma/client'

// seed clients in database
export const seedClients = async (prisma: PrismaClient) => {
  const clients = await prisma.clients.createMany({
    data: [
      {
        client_id: 1,
        client_name: 'Acme Corp',
        business_unit: 'Chemical Engineering',
      },
      {
        client_id: 2,
        client_name: 'Acme Corp',
        business_unit: 'Software Integration',
      },
      {
        client_id: 3,
        client_name: 'ABC Company',
      },
      {
        client_id: 4,
        client_name: 'Financial Services',
        business_unit: 'Accounting',
      },
      {
        client_id: 5,
        client_name: 'Financial Services',
        business_unit: 'Investments',
      },
    ],
  })

  if (clients.count !== 5) {
    console.log(`All clients seeded: false`)
  }
}
