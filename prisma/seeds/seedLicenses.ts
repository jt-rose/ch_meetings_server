import { PrismaClient } from '@prisma/client'

// prisma seeding for workshops
// with relational fields for workshop_sessions,
// workshop_notes, and change_logs

export const seedLicenses = async (prisma: PrismaClient) => {
  const licenses = await prisma.available_licenses.createMany({
    data: [
      {
        client_id: 1,
        course_id: 1,
        remaining_amount: 193,
        created_by: 2,
        last_updated: new Date(),
      },
      {
        client_id: 1,
        course_id: 3,
        remaining_amount: 35,
        created_by: 2,
        last_updated: new Date(),
      },
      {
        client_id: 2,
        course_id: 1,
        remaining_amount: 46,
        created_by: 2,
        last_updated: new Date(),
      },
      {
        client_id: 3,
        course_id: 1,
        remaining_amount: 78,
        created_by: 2,
        last_updated: new Date(),
      },
      {
        client_id: 4,
        course_id: 1,
        remaining_amount: 63,
        created_by: 2,
        last_updated: new Date(),
      },
      {
        client_id: 4,
        course_id: 3,
        remaining_amount: 20,
        created_by: 2,
        last_updated: new Date(),
      },
      {
        client_id: 5,
        course_id: 2,
        remaining_amount: 75,
        created_by: 2,
        last_updated: new Date(),
      },
      {
        client_id: 5,
        course_id: 3,
        remaining_amount: 15,
        created_by: 2,
        last_updated: new Date(),
      },
      {
        client_id: 5,
        course_id: 4,
        remaining_amount: 18,
        created_by: 2,
        last_updated: new Date(),
      },
      {
        client_id: 6,
        course_id: 1,
        remaining_amount: 0,
        created_by: 2,
        last_updated: new Date(),
      },
    ],
  })

  if (licenses.count !== 10) {
    console.log(`All licenses seeded: false`)
  }

  const reservedLicenses = await prisma.reserved_licenses.createMany({
    data: [
      {
        license_id: 1,
        reserved_amount: 23,
        reserved_status: 'FINALIZED',
        workshop_id: 1,
        created_by: 2,
        created_at: new Date(),
        last_updated: new Date(),
      },
    ],
  })

  if (reservedLicenses.count !== 1) {
    console.log(`All reserved licenses seeded: false`)
  }

  const licenseChanges = await prisma.license_changes.createMany({
    data: [
      {
        updated_amount: 220,
        amount_change: 220,
        change_note: 'added to program',
        license_id: 1,
        created_by: 1,
      },
      {
        updated_amount: 193,
        amount_change: -23,
        change_note: 'Reserved 23 licenses for workshop ID: 1',
        license_id: 1,
        created_by: 1,
        workshop_id: 1,
      },
      {
        updated_amount: 193,
        amount_change: 0,
        change_note:
          'Completed workshop: Workshop-ID 1, finalized use of 23 licenses',
        license_id: 1,
        created_by: 1,
        workshop_id: 1,
      },
      {
        updated_amount: 35,
        amount_change: 35,
        change_note: 'added to program',
        license_id: 2,
        created_by: 1,
      },
      {
        updated_amount: 46,
        amount_change: 46,
        change_note: 'added to program',
        license_id: 3,
        created_by: 1,
      },
      {
        updated_amount: 78,
        amount_change: 78,
        change_note: 'added to program',
        license_id: 4,
        created_by: 1,
      },
      {
        updated_amount: 63,
        amount_change: 63,
        change_note: 'added to program',
        license_id: 5,
        created_by: 1,
      },
      {
        updated_amount: 20,
        amount_change: 20,
        change_note: 'added to program',
        license_id: 6,
        created_by: 1,
      },
      {
        updated_amount: 75,
        amount_change: 75,
        change_note: 'added to program',
        license_id: 7,
        created_by: 1,
      },
      {
        updated_amount: 15,
        amount_change: 15,
        change_note: 'added to program',
        license_id: 8,
        created_by: 1,
      },
      {
        updated_amount: 18,
        amount_change: 18,
        change_note: 'added to program',
        license_id: 9,
        created_by: 1,
      },
      {
        updated_amount: 100,
        amount_change: 100,
        change_note: 'added to program',
        license_id: 10,
        created_by: 1,
      },
      {
        updated_amount: 0,
        amount_change: -100,
        change_note: 'removed from program',
        license_id: 10,
        created_by: 1,
      },
    ],
  })

  if (licenseChanges.count !== 13) {
    console.log(`All license changes seeded: false`)
  }
}
