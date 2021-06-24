import { PrismaClient } from '@prisma/client'

// seed clients in database
export const seedClients = async (prisma: PrismaClient) => {
  const clients = await prisma.clients.createMany({
    data: [
      {
        //client_id: 1,
        client_name: 'Acme Corp',
        business_unit: 'Chemical Engineering',
      },
      {
        //client_id: 2,
        client_name: 'Acme Corp',
        business_unit: 'Software Integration',
      },
      {
        //client_id: 3,
        client_name: 'ABC Company',
      },
      {
        //client_id: 4,
        client_name: 'Financial Services',
        business_unit: 'Accounting',
      },
      {
        //client_id: 5,
        client_name: 'Financial Services',
        business_unit: 'Investments',
      },
      {
        client_name: 'Med Clinique',
        active: false,
      },
    ],
  })

  if (clients.count !== 6) {
    console.log(`All clients seeded: false`)
  }

  const clientNotes = await prisma.client_notes.createMany({
    data: [
      {
        //note_id
        client_id: 1,
        note: '70% of 2021 licenses should be used before October 2021',
      },
      {
        client_id: 6,
        note: 'program on hiatus as client undergoes acquisition by BioTech Inc.',
      },
    ],
  })

  if (clientNotes.count !== 2) {
    console.log(`All client notes seeded: false`)
  }
}
