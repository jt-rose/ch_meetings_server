CREATE TYPE SESSION_STATUS_ENUM AS ENUM (
    'REQUESTED',
    'SCHEDULED',
    'COMPLETED',
    'HOLD A',
    'HOLD B' -- possible extras: PAID, REJECTED, REQUEST_NEW_DATES, REQUEST_INFO, etc.
);
CREATE TYPE REGION_ENUM AS ENUM (
    'NAM',
    'LATAM',
    'EMEA',
    'APAC',
    'ANZ'
);
CREATE TYPE USER_TYPE_ENUM AS ENUM (
    'USER',
    'ADMIN' -- 'CLIENT', if needed
);
CREATE TABLE clients (
    client_id SERIAL PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    business_unit VARCHAR(255)
);
CREATE TABLE managers (
    manager_id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_password VARCHAR(255) NOT NULL,
    user_type USER_TYPE_ENUM NOT NULL -- may add regions for managers later if needed
);
CREATE TABLE advisors (
    advisor_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL
);
CREATE TABLE unavailable_days (
    unavailable_id SERIAL PRIMARY KEY,
    advisor_id INT REFERENCES advisors (advisor_id) NOT NULL,
    day_unavailable DATE NOT NULL,
    note TEXT
);
CREATE TABLE languages (
    language_id SERIAL PRIMARY KEY,
    advisor_id INT REFERENCES advisors (advisor_id) NOT NULL,
    advisor_language VARCHAR(255) NOT NULL
);
CREATE TABLE regions (
    region_id SERIAL PRIMARY KEY,
    advisor_id INT REFERENCES advisors (advisor_id) NOT NULL,
    advisor_region REGION_ENUM NOT NULL
);
CREATE TABLE advisor_notes (
    note_id SERIAL PRIMARY KEY,
    advisor_id INT REFERENCES advisors (advisor_id) NOT NULL,
    advisor_note TEXT NOT NULL
);
CREATE TABLE courses (
    course_id SERIAL PRIMARY KEY,
    course_name VARCHAR(255) UNIQUE NOT NULL,
    course_description TEXT NOT NULL,
    active BOOLEAN NOT NULL,
    virtual_course BOOLEAN NOT NULL,
    -- vilt, may switch to 'in_person' if vilt becomes default
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE coursework (
    coursework_id SERIAL PRIMARY KEY,
    coursework_name VARCHAR(255) UNIQUE NOT NULL,
    coursework_description TEXT,
    -- will leave nullable for now
    active BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE TABLE courses_and_coursework (
    course_and_coursework_id SERIAL PRIMARY KEY,
    course_id INT REFERENCES courses(course_id) NOT NULL,
    coursework_id INT REFERENCES coursework(coursework_id) NOT NULL
);
-- initially, separating a workshop request from the workshop entity
-- was considered, but since much of the data is shared, this did not make sense
-- these have been combined, with the requested advisor distinguished
-- from the assigned advisor
-- and the associated session statuses used to determine
-- the scheduling status of the work shop (see note below)
CREATE TABLE workshops (
    workshop_id SERIAL PRIMARY KEY,
    course_id INT REFERENCES courses (course_id) NOT NULL,
    cohort_name VARCHAR(255) NOT NULL,
    requested_advisor_id INT REFERENCES advisors (advisor_id) NOT NULL,
    backup_requested_advisor_id INT REFERENCES advisors (advisor_id),
    assigned_advisor_id INT REFERENCES advisors (advisor_id),
    -- workshop_location can refer to a physical address or zoom/ teams
    workshop_location VARCHAR(255) NOT NULL,
    workshop_region REGION_ENUM NOT NULL,
    class_size INT,
    -- nullable for situations where we don't yet know the number
    client_id INT REFERENCES clients (client_id) NOT NULL,
    open_air_id VARCHAR(255) NOT NULL,
    time_zone VARCHAR(10) NOT NULL,
    workshop_language VARCHAR(255) NOT NULL,
    record_attendance BOOLEAN NOT NULL,
    deleted BOOLEAN NOT NULL DEFAULT FALSE
);
-- different versions of coursework are available for each course
-- this table will track which one has been chosen for each workshop
CREATE TABLE workshop_coursework (
    workshop_coursework_id SERIAL PRIMARY KEY,
    workshop_id INT REFERENCES workshops (workshop_id) NOT NULL,
    coursework_id INT REFERENCES coursework (coursework_id) NOT NULL
);
-- store session templates linked to courses
CREATE TABLE workshop_session_sets (
    session_set_id SERIAL PRIMARY KEY,
    course_id INT REFERENCES courses(course_id) NOT NULL,
    session_name VARCHAR(255) NOT NULL,
    session_order INT NOT NULL
);
-- to determine the scheduling status of a workshop, a join will be used
-- to query it's associated sessions
-- this allows us to store detailed info about each session
-- for example, if just one session needs to be rescheduled
CREATE TABLE workshop_sessions (
    workshop_session_id SERIAL PRIMARY KEY,
    workshop_id INT REFERENCES workshops (workshop_id) NOT NULL,
    session_name VARCHAR(255) NOT NULL,
    date_and_time TIMESTAMPTZ,
    -- date and time are set to nullable
    -- to accomodate requests where the date is not set yet
    -- server or DB validation will be used
    -- to mandate a date_and_time value
    -- when session_status has moved out of 'REQUESTED'
    session_status SESSION_STATUS_ENUM NOT NULL,
    duration_in_hours DECIMAL(2, 1) NOT NULL,
    zoom_link VARCHAR(255)
);
-- start time ranges for session requests can be entered
-- time range will default on server to cover a 24 hour period
-- of each selected date if not specified by user
-- multiple time ranges per session can be requested
-- in case there are gaps that won't work
CREATE TABLE requested_start_times (
    request_id SERIAL PRIMARY KEY,
    workshop_session_id INT REFERENCES workshop_sessions (workshop_session_id) NOT NULL,
    earliest_start_time TIMESTAMPTZ NOT NULL,
    latest_start_time TIMESTAMPTZ NOT NULL
);
CREATE TABLE change_log (
    log_id SERIAL PRIMARY KEY,
    workshop_id INT REFERENCES workshops (workshop_id) NOT NULL,
    note TEXT NOT NULL,
    log_date TIMESTAMPTZ NOT NULL
);
CREATE TABLE manager_assignments (
    assignment_id SERIAL PRIMARY KEY,
    workshop_id INT REFERENCES workshops (workshop_id) NOT NULL,
    manager_id INT REFERENCES managers (manager_id) NOT NULL,
    active BOOLEAN NOT NULL
);
CREATE TABLE manager_clients (
    manager_client_id SERIAL PRIMARY KEY,
    manager_id INT REFERENCES managers(manager_id) NOT NULL,
    client_id INT REFERENCES clients(client_id) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE TABLE workshop_notes (
    note_id SERIAL PRIMARY KEY,
    workshop_id INT REFERENCES workshops (workshop_id) NOT NULL,
    note TEXT NOT NULL
);
CREATE TABLE session_notes (
    note_id SERIAL PRIMARY KEY,
    workshop_session_id INT REFERENCES workshop_sessions (workshop_session_id) NOT NULL,
    note TEXT NOT NULL
);