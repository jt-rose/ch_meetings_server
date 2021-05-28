CREATE TYPE SESSION_STATUS_ENUM AS ENUM (
    'REQUESTED',
    'SCHEDULED',
    'COMPLETED',
    'HOLD A',
    'HOLD B' -- possible extras: PAID, REJECTED, REQUEST_NEW_DATES, REQUEST_INFO, etc.
);
CREATE TABLE clients (
    client_id SERIAL PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    business_unit VARCHAR(255)
);
CREATE TABLE managers (
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) PRIMARY KEY,
    email_password VARCHAR(255) NOT NULL
);
CREATE TABLE advisors (
    email VARCHAR(255) PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL
);
CREATE TABLE unavailable_days (
    unavailable_id SERIAL PRIMARY KEY,
    advisor VARCHAR(255) REFERENCES advisors (email) NOT NULL,
    day_unavailable DATE NOT NULL,
    note TEXT
);
CREATE TABLE languages (
    language_id SERIAL PRIMARY KEY,
    advisor VARCHAR(255) REFERENCES advisors (email) NOT NULL,
    advisor_language VARCHAR(255) NOT NULL
);
CREATE TABLE regions (
    region_id SERIAL PRIMARY KEY,
    advisor_region VARCHAR(255) NOT NULL,
    advisor VARCHAR(255) REFERENCES advisors (email) NOT NULL
);
CREATE TABLE courses (
    course_name VARCHAR(255) PRIMARY KEY,
    course_description TEXT NOT NULL,
    active BOOLEAN NOT NULL,
    virtual_course BOOLEAN NOT NULL,
    -- vilt, may switch to 'in_person' if vilt becomes default
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- initially, separating a workshop request from the workshop entity
-- was considered, but since much of the data is shared, this did not make sense
-- these have been combined, with the requested advisor distinguished
-- from the assigned advisor
-- and the associated session statuses used to determine
-- the scheduling status of the work shop (see note below)
CREATE TABLE workshops (
    workshop_id SERIAL PRIMARY KEY,
    course_type VARCHAR(255) REFERENCES courses (course_name) NOT NULL,
    requested_advisor VARCHAR(255) REFERENCES advisors (email) NOT NULL,
    backup_requested_advisor VARCHAR(255) REFERENCES advisors (email),
    assigned_advisor VARCHAR(255) REFERENCES advisors (email),
    workshop_location VARCHAR(255) NOT NULL,
    client INT REFERENCES clients (client_id) NOT NULL,
    open_air_id VARCHAR(255) NOT NULL,
    time_zone VARCHAR(10) NOT NULL,
    workshop_language VARCHAR(255) NOT NULL,
    record_attendance BOOLEAN NOT NULL
);
-- to determine the scheduling status of a workshop, a join will be used
-- to query it's associated sessions
-- this allows us to store detailed info about each session
-- for example, if just one session needs to be rescheduled
CREATE TABLE workshop_sessions (
    workshop_session_id SERIAL PRIMARY KEY,
    workshop_id INT REFERENCES workshops (workshop_id) NOT NULL,
    date_and_time TIMESTAMPTZ NOT NULL,
    session_status SESSION_STATUS_ENUM NOT NULL,
    duration_in_hours DECIMAL(2, 1) NOT NULL,
    zoom_link VARCHAR(255)
);
-- currently, sessions are set up around specific dates
-- with date ranges left for associated session notes
-- this may be changed later to more explicitly recognize date ranges
CREATE TABLE change_log (
    log_id SERIAL PRIMARY KEY,
    workshop INT REFERENCES workshops (workshop_id) NOT NULL,
    note TEXT NOT NULL,
    log_date TIMESTAMPTZ NOT NULL
);
CREATE TABLE manager_assignments (
    assignment_id SERIAL PRIMARY KEY,
    workshop_id INT REFERENCES workshops (workshop_id) NOT NULL,
    manager VARCHAR(255) REFERENCES managers (email) NOT NULL,
    active BOOLEAN NOT NULL
);
CREATE TABLE workshop_notes (
    notes_id SERIAL PRIMARY KEY,
    workshop_id INT REFERENCES workshops (workshop_id) NOT NULL,
    note TEXT NOT NULL
);
CREATE TABLE session_notes (
    notes_id SERIAL PRIMARY KEY,
    workshop_session_id INT REFERENCES workshop_sessions (workshop_session_id) NOT NULL,
    note TEXT NOT NULL
)