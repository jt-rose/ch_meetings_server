/*
CREATE TABLE workshops (
    workshop_id BIGSERIAL PRIMARY KEY,
    course_type VARCHAR(255) REFERENCES courses (course_name) NOT NULL,
    advisor VARCHAR(255) REFERENCES advisors (email) NOT NULL,
    conference_type VARCHAR(255) NOT NULL,
    -- change to enum later, ex: in_person, zoom, teams, etc.
    client BIGINT REFERENCES clients (client_id) NOT NULL,
    open_air_id VARCHAR(255) NOT NULL,
    workshop_status VARCHAR(255) NOT NULL,
    -- change to enum later
    time_zone VARCHAR(10) NOT NULL,
    workshop_language VARCHAR(255) NOT NULL,
    record_attendance BOOLEAN NOT NULL
);
*/
import { objectType } from 'nexus'

export const workshop = objectType({
  name: 'Workshop',
  description: '',
  definition(t) {
    t.int('workshop_id')
    t.string('course_type')
    t.string('advisor')
    t.string('conference_type')
    t.string('client')
    t.string('open_air_id')
    t.string('workshop_status')
    t.string('time_zone')
    t.string('workshop_language')
    t.boolean('record_attendance')
  },
})
