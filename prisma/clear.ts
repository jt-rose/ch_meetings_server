import { prisma } from '../src/prisma'
import { resetAutoInc } from './resetAutoInc'

export async function clear() {
  // remove error logs
  await prisma.error_log.deleteMany()

  // remove licenses
  await prisma.license_changes.deleteMany()
  await prisma.reserved_licenses.deleteMany()
  await prisma.available_licenses.deleteMany()

  // remove managers related data
  await prisma.manager_clients.deleteMany()
  await prisma.manager_assignments.deleteMany()

  //remove workshops and related data
  await prisma.workshop_session_change_requests.deleteMany()
  await prisma.workshop_change_log.deleteMany()
  await prisma.workshop_sessions.deleteMany()
  await prisma.workshop_notes.deleteMany()
  await prisma.workshop_coursework.deleteMany()
  await prisma.workshop_change_requests.deleteMany()
  await prisma.workshops.deleteMany()
  await prisma.workshop_groups.deleteMany()

  // remove advisors and related data
  await prisma.advisor_unavailable_times.deleteMany()
  await prisma.advisor_notes.deleteMany()
  await prisma.languages.deleteMany()
  await prisma.regions.deleteMany()
  await prisma.advisors.deleteMany()

  // remove courses and clients
  await prisma.workshop_session_sets.deleteMany()
  await prisma.courses_and_coursework.deleteMany()
  await prisma.coursework.deleteMany()
  await prisma.courses.deleteMany()
  await prisma.client_notes.deleteMany()
  await prisma.clients.deleteMany()

  // remove managers
  await prisma.managers.deleteMany()

  // reset auto-increment for testing
  await resetAutoInc()

  // disconnect prisma
  await prisma.$disconnect()
}
