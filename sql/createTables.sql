CREATE TYPE SESSION_STATUS_ENUM AS ENUM (
    'REQUESTED',
    'VETTING',
    'HOLDING',
    'SCHEDULED',
    'COMPLETED',
    'CANCELLED'
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
    'COORDINATOR',
    'ADMIN',
    'SUPERADMIN' -- 'CLIENT', if needed
);
CREATE TYPE RESERVED_LICENSE_STATUS_ENUM AS ENUM (
    'RESERVED',
    'FINALIZED',
    'CANCELLED'
);
CREATE TABLE managers (
    manager_id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_password VARCHAR(255) NOT NULL,
    user_type USER_TYPE_ENUM NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE -- may add regions for managers later if needed
);
CREATE TABLE clients (
    client_id SERIAL PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    business_unit VARCHAR(255),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_by INT REFERENCES managers(manager_id) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE client_notes (
    note_id SERIAL PRIMARY KEY,
    created_by INT REFERENCES managers(manager_id) NOT NULL,
    client_id INT REFERENCES clients(client_id) NOT NULL,
    note TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE advisors (
    advisor_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE TABLE advisor_unavailable_times (
    unavailable_id SERIAL PRIMARY KEY,
    advisor_id INT REFERENCES advisors (advisor_id) NOT NULL,
    unavailable_start_time TIMESTAMPTZ NOT NULL,
    unavailable_end_time TIMESTAMPTZ NOT NULL,
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
    created_by INT REFERENCES managers(manager_id) NOT NULL,
    advisor_id INT REFERENCES advisors (advisor_id) NOT NULL,
    advisor_note TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE courses (
    course_id SERIAL PRIMARY KEY,
    created_by INT REFERENCES managers(manager_id) NOT NULL,
    course_name VARCHAR(255) UNIQUE NOT NULL,
    course_description TEXT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    virtual_course BOOLEAN NOT NULL,
    -- vilt, may switch to 'in_person' if vilt becomes default
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE coursework (
    coursework_id SERIAL PRIMARY KEY,
    created_by INT REFERENCES managers(manager_id) NOT NULL,
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
CREATE TABLE workshop_groups (
    group_id SERIAL PRIMARY KEY,
    group_name VARCHAR(255) NOT NULL,
    created_by INT REFERENCES managers(manager_id) NOT NULL
);
CREATE TABLE workshop_group_notes (
    note_id SERIAL PRIMARY KEY,
    created_by INT REFERENCES managers(manager_id) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    group_id INT REFERENCES workshop_groups(group_id) NOT NULL,
    note TEXT NOT NULL
);
-- initially, separating a workshop request from the workshop entity
-- was considered, but since much of the data is shared, this did not make sense
-- these have been combined, with the requested advisor distinguished
-- from the assigned advisor
-- and the associated session statuses used to determine
-- the scheduling status of the work shop (see note below)
CREATE TABLE workshops (
    workshop_id SERIAL PRIMARY KEY,
    group_id INT REFERENCES workshop_groups (group_id),
    created_by INT REFERENCES managers (manager_id) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- start and end dates will be manually updated
    -- as workshop sessions are added, updated, deleted
    -- this will allow for much simpler sorting by date
    workshop_start_time TIMESTAMPTZ NOT NULL,
    workshop_end_time TIMESTAMPTZ NOT NULL,
    workshop_status SESSION_STATUS_ENUM NOT NULL,
    course_id INT REFERENCES courses (course_id) NOT NULL,
    cohort_name VARCHAR(255) UNIQUE NOT NULL,
    requested_advisor_id INT REFERENCES advisors (advisor_id),
    -- nullable for no preference
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
    in_person BOOLEAN NOT NULL,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    participant_sign_up_link VARCHAR(255) NOT NULL,
    launch_participant_sign_ups BOOLEAN NOT NULL DEFAULT FALSE
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
    created_by INT REFERENCES managers(manager_id) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    workshop_id INT REFERENCES workshops (workshop_id) NOT NULL,
    session_name VARCHAR(255) NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    session_status SESSION_STATUS_ENUM NOT NULL,
    meeting_link VARCHAR(255)
);
-- start time ranges for session requests can be entered
-- time range will default on server to cover a 24 hour period
-- of each selected date if not specified by user
-- multiple time ranges per session can be requested
-- in case there are gaps that won't work
--CREATE TABLE requested_start_times (
--    request_id SERIAL PRIMARY KEY,
--    workshop_session_id INT REFERENCES workshop_sessions (workshop_session_id) NOT NULL,
--    earliest_start_time TIMESTAMPTZ NOT NULL,
--    latest_start_time TIMESTAMPTZ NOT NULL
--);
CREATE TABLE workshop_change_log (
    log_id SERIAL PRIMARY KEY,
    workshop_id INT REFERENCES workshops (workshop_id) NOT NULL,
    note TEXT NOT NULL,
    created_by INT REFERENCES managers (manager_id),
    -- nullable for system updates not connected to a manager
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE manager_assignments (
    assignment_id SERIAL PRIMARY KEY,
    workshop_id INT REFERENCES workshops (workshop_id) NOT NULL,
    manager_id INT REFERENCES managers (manager_id) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE TABLE manager_clients (
    manager_client_id SERIAL PRIMARY KEY,
    manager_id INT REFERENCES managers(manager_id) NOT NULL,
    client_id INT REFERENCES clients(client_id) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE TABLE workshop_notes (
    note_id SERIAL PRIMARY KEY,
    created_by INT REFERENCES managers(manager_id) NOT NULL,
    workshop_id INT REFERENCES workshops (workshop_id) NOT NULL,
    note TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- Licenses will be tracked across two tables
-- one for available licenses
-- and one for licenses currently reserved for a scheduled workshop
-- a third table will track changes to each of these tables
-- for accounting purposes
CREATE TABLE available_licenses (
    license_id SERIAL PRIMARY KEY,
    course_id INT REFERENCES courses(course_id) NOT NULL,
    client_id INT REFERENCES clients(client_id) NOT NULL,
    remaining_amount INT NOT NULL,
    created_by INT REFERENCES managers(manager_id) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_updated TIMESTAMPTZ NOT NULL
);
CREATE TABLE reserved_licenses (
    reserved_license_id SERIAL PRIMARY KEY,
    license_id INT REFERENCES available_licenses(license_id) NOT NULL,
    reserved_amount INT NOT NULL,
    reserved_status RESERVED_LICENSE_STATUS_ENUM NOT NULL,
    workshop_id INT REFERENCES workshops(workshop_id) NOT NULL,
    created_by INT REFERENCES managers(manager_id) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_updated TIMESTAMPTZ NOT NULL
);
CREATE TABLE license_changes (
    license_change_id SERIAL PRIMARY KEY,
    license_id INT REFERENCES available_licenses(license_id) NOT NULL,
    updated_amount INT NOT NULL,
    amount_change INT NOT NULL,
    workshop_id INT REFERENCES workshops(workshop_id),
    -- nullable, for when changes are not related to workshops
    created_by INT REFERENCES managers(manager_id) NOT NULL,
    -- references who made the change
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    change_note TEXT NOT NULL -- will be autogenerated for workshops
);
-- we could break this into two tables
-- one for participants and one for participant sign ups (for signing up for multiple workshops)
-- however, as we are keeping the signup process simple and avoiding a login
-- using a url/signup/:uuid instead (with @email validation)
-- we can settle for a small degree of duplicate info
-- we can also use cookies to autopopulate workshop sign up fields
CREATE TABLE workshop_participants (
    participant_id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    --participant_role ENUM
    -- signed_up DATE
    workshop_id INT REFERENCES workshops(workshop_id) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);