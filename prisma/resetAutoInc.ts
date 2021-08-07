import { prisma } from '../src/prisma'

/*
 For testing, we need to repeatedly seed and clear the data.
 Many of our SQL objects are highly relational and reference
 SERIAL PKs of foreign tables.
 Clearing the data does not reset the SERIAL auto-increment.
 EXAMPLE: INSERT 'Joe' PK -> 1, DELETE WHERE PK=1, INSERT 'Joe' PK -> 2
 The generated PK will continue to increase for Joe
 making it impossible to reference without querying first.
 Unfortunately, simply declaring what integer the PK should be
 will make it go out of sync with SQL's auto-increment
 and will cause errors when SQL attempts to generate an integer already in use.
 The workaround to this is to manually reset the auto-increment sequence 
 for each table upon clearing the database, which is what this function does.

 One further limitation is that SQL only allows single commands
 via prepared statements, so these will need to each be executed one by one.

 Fortunately, this is only a concern in a testing environment
 and won't matter in production, since we would need to fetch 
 the PKs first anyway.
 */

export const resetAutoInc = async () => {
  await prisma.$queryRaw`ALTER SEQUENCE clients_client_id_seq RESTART WITH 1;`
  await prisma.$queryRaw`ALTER SEQUENCE client_notes_note_id_seq RESTART WITH 1;`
  await prisma.$queryRaw`ALTER SEQUENCE managers_manager_id_seq RESTART WITH 1;`
  await prisma.$queryRaw`ALTER SEQUENCE advisors_advisor_id_seq RESTART WITH 1;`
  await prisma.$queryRaw`ALTER SEQUENCE advisor_unavailable_times_unavailable_id_seq RESTART WITH 1;`
  await prisma.$queryRaw`ALTER SEQUENCE languages_language_id_seq RESTART WITH 1;`
  await prisma.$queryRaw`ALTER SEQUENCE regions_region_id_seq RESTART WITH 1;`
  await prisma.$queryRaw`ALTER SEQUENCE advisor_notes_note_id_seq RESTART WITH 1;`
  await prisma.$queryRaw`ALTER SEQUENCE courses_course_id_seq RESTART WITH 1;`
  await prisma.$queryRaw`ALTER SEQUENCE coursework_coursework_id_seq RESTART WITH 1;`
  await prisma.$queryRaw`ALTER SEQUENCE courses_and_coursework_course_and_coursework_id_seq RESTART WITH 1;`
  await prisma.$queryRaw`ALTER SEQUENCE workshops_workshop_id_seq RESTART WITH 1;`
  await prisma.$queryRaw`ALTER SEQUENCE workshop_groups_group_id_seq RESTART WITH 1;`
  await prisma.$queryRaw`ALTER SEQUENCE workshop_group_notes_note_id_seq RESTART WITH 1;`
  await prisma.$queryRaw`ALTER SEQUENCE workshop_coursework_workshop_coursework_id_seq RESTART WITH 1;`
  await prisma.$queryRaw`ALTER SEQUENCE workshop_session_sets_session_set_id_seq RESTART WITH 1;`
  await prisma.$queryRaw`ALTER SEQUENCE workshop_sessions_workshop_session_id_seq RESTART WITH 1;`
  await prisma.$queryRaw`ALTER SEQUENCE workshop_change_log_log_id_seq RESTART WITH 1;`
  await prisma.$queryRaw`ALTER SEQUENCE manager_assignments_assignment_id_seq RESTART WITH 1;`
  await prisma.$queryRaw`ALTER SEQUENCE manager_clients_manager_client_id_seq RESTART WITH 1;`
  await prisma.$queryRaw`ALTER SEQUENCE workshop_notes_note_id_seq RESTART WITH 1;`
  await prisma.$queryRaw`ALTER SEQUENCE available_licenses_license_id_seq RESTART WITH 1;`
  await prisma.$queryRaw`ALTER SEQUENCE reserved_licenses_reserved_license_id_seq RESTART WITH 1;`
  await prisma.$queryRaw`ALTER SEQUENCE license_changes_license_change_id_seq RESTART WITH 1;`
}
