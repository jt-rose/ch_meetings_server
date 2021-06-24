import { PrismaClient } from '@prisma/client'

// prisma seeding for workshops
// with relational fields for workshop_sessions,
// workshop_notes, and change_logs

export const seedLicenses = async (prisma: PrismaClient) => {
  const licenses = await prisma.licenses.createMany({
    data: [
      {
        client_id: 1,
        course_id: 1,
        remaining_amount: 193,
      },
      {
        client_id: 1,
        course_id: 3,
        remaining_amount: 35,
      },
      {
        client_id: 2,
        course_id: 1,
        remaining_amount: 46,
      },
      {
        client_id: 3,
        course_id: 1,
        remaining_amount: 78,
      },
      {
        client_id: 4,
        course_id: 1,
        remaining_amount: 63,
      },
      {
        client_id: 4,
        course_id: 3,
        remaining_amount: 20,
      },
      {
        client_id: 5,
        course_id: 2,
        remaining_amount: 75,
      },
      {
        client_id: 5,
        course_id: 3,
        remaining_amount: 15,
      },
      {
        client_id: 5,
        course_id: 4,
        remaining_amount: 18,
      },
      {
        client_id: 6,
        course_id: 1,
        remaining_amount: 0,
      },
    ],
  })

  if (licenses.count !== 10) {
    console.log(`All licenses seeded: false`)
  }

  const licenseChanges = await prisma.license_changes.createMany({
    data: [
      {
        amount_change: 220,
        change_note: 'added to program',
        license_id: 1,
        manager_id: 1,
      },
      {
        amount_change: -23,
        change_note: 'Completed workshop: Workshop-ID 1',
        license_id: 1,
        manager_id: 1,
        workshop_id: 1,
      },
      {
        amount_change: 35,
        change_note: 'added to program',
        license_id: 2,
        manager_id: 1,
      },
      {
        amount_change: 46,
        change_note: 'added to program',
        license_id: 3,
        manager_id: 1,
      },
      {
        amount_change: 78,
        change_note: 'added to program',
        license_id: 4,
        manager_id: 1,
      },
      {
        amount_change: 63,
        change_note: 'added to program',
        license_id: 5,
        manager_id: 1,
      },
      {
        amount_change: 20,
        change_note: 'added to program',
        license_id: 6,
        manager_id: 1,
      },
      {
        amount_change: 75,
        change_note: 'added to program',
        license_id: 7,
        manager_id: 1,
      },
      {
        amount_change: 15,
        change_note: 'added to program',
        license_id: 8,
        manager_id: 1,
      },
      {
        amount_change: 18,
        change_note: 'added to program',
        license_id: 9,
        manager_id: 1,
      },
      {
        amount_change: 100,
        change_note: 'added to program',
        license_id: 10,
        manager_id: 1,
      },
      {
        amount_change: -100,
        change_note: 'removed from program',
        license_id: 10,
        manager_id: 1,
      },
    ],
  })

  if (licenseChanges.count !== 12) {
    console.log(`All license changes seeded: false`)
  }
}
