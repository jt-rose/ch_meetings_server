CREATE TYPE WORKSHOP_STATUS AS ENUM (
    'REQUESTED',
    'SCHEDULED',
    'COMPLETED',
    'HOLD A',
    'HOLD B' -- possible extras: PAID, REJECTED, REQUEST_NEW_DATES, REQUEST_INFO, etc.
);
CREATE TABLE clients (
    client_id BIGSERIAL PRIMARY KEY,
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
    unavailable_id BIGSERIAL PRIMARY KEY,
    advisor VARCHAR(255) REFERENCES advisors (email) NOT NULL,
    day_unavailable DATE NOT NULL,
    note TEXT
);
CREATE TABLE languages (
    language_id BIGSERIAL PRIMARY KEY,
    advisor VARCHAR(255) REFERENCES advisors (email) NOT NULL,
    advisor_language VARCHAR(255) NOT NULL
);
CREATE TABLE regions (
    region_id BIGSERIAL PRIMARY KEY,
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
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW() -- store changes?
);
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
CREATE TABLE change_log (
    log_id BIGSERIAL PRIMARY KEY,
    workshop BIGINT REFERENCES workshops (workshop_id) NOT NULL,
    note TEXT NOT NULL,
    log_date TIMESTAMPTZ NOT NULL
);
CREATE TABLE manager_assignments (
    assignment_id BIGSERIAL PRIMARY KEY,
    workshop_id BIGINT REFERENCES workshops (workshop_id) NOT NULL,
    manager VARCHAR(255) REFERENCES managers (email) NOT NULL,
    current_involvement VARCHAR(255) NOT NULL -- active, inactive - change to enums
);
CREATE TABLE workshop_notes (
    notes_id BIGSERIAL PRIMARY KEY,
    workshop_id BIGINT REFERENCES workshops (workshop_id) NOT NULL,
    apply_to_all_sessions BOOLEAN NOT NULL,
    -- will apply to each session if true
    -- otherwise the specific workshop_session_id will be listed
    workshop_session_id BIGINT REFERENCES workshop_sessions (workshop_session_id),
    note TEXT NOT NULL
);