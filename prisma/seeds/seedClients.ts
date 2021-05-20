import { PrismaClient } from '@prisma/client'

// seed clients in database
export const seedClients = async (prisma: PrismaClient) => {
  const clients = await prisma.clients.createMany({
    data: [
      {
        client_name: 'Acme Corp',
        business_unit: 'Chemical Engineering',
      },
      {
        client_name: 'Acme Corp',
        business_unit: 'Software Integration',
      },
      {
        client_name: 'ABC Company',
      },
      {
        client_name: 'Financial Services',
        business_unit: 'Accounting',
      },
      {
        client_name: 'Financial Services',
        business_unit: 'Investments',
      },
    ],
  })

  console.log(`All clients seeded: ${clients.count === 5}`)
}
