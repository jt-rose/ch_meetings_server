import { prisma } from '../src/prisma'

export async function clear() {
  // remove managers and related data
  await prisma.manager_clients.deleteMany()
  await prisma.manager_assignments.deleteMany()
  await prisma.managers.deleteMany()

  //remove workshops and related data
  await prisma.change_log.deleteMany()
  await prisma.session_notes.deleteMany()
  await prisma.requested_start_times.deleteMany()
  await prisma.workshop_sessions.deleteMany()
  await prisma.workshop_notes.deleteMany()
  await prisma.workshop_coursework.deleteMany()
  await prisma.workshops.deleteMany()

  // remove advisors and related data
  await prisma.unavailable_days.deleteMany()
  await prisma.advisor_notes.deleteMany()
  await prisma.languages.deleteMany()
  await prisma.regions.deleteMany()
  await prisma.advisors.deleteMany()

  // remove courses and clients
  await prisma.workshop_session_sets.deleteMany()
  await prisma.courses_and_coursework.deleteMany()
  await prisma.coursework.deleteMany()
  await prisma.courses.deleteMany()
  await prisma.clients.deleteMany()

  // disconnect prisma
  await prisma.$disconnect()
}
