/*
CREATE TABLE workshop_sessions (
    workshop_session_id BIGSERIAL PRIMARY KEY,
    workshop_id BIGINT REFERENCES workshops (workshop_id) NOT NULL,
    session_date DATE NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    session_status VARCHAR(255) NOT NULL,
    -- switch to enums
    duration_in_hours DECIMAL(1, 1) NOT NULL,
    zoom_link VARCHAR(255)
);
 */
import { objectType } from 'nexus'

export const workshopSessions = objectType({
  name: 'Workshop_Sessions',
  description: '',
  definition(t) {
    t.int('workshop_session_id')
    t.int('workshop_id')
    t.string('session_date')
    t.string('start_time')
    t.string('session_status')
    t.float('duration_in_hours')
    t.string('zoom_link')
  },
})
