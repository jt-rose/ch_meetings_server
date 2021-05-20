INSERT INTO courses (
        course_name,
        course_description,
        active,
        virtual_course
    )
VALUES ('Course 101', 'the basics', TRUE, TRUE),
    (
        'Course 102 - In-Person',
        'the basics, but in person',
        TRUE,
        FALSE
    ),
    (
        'Course 201',
        'the intermediate level',
        TRUE,
        TRUE
    ),
    (
        'Course 301',
        'the advanced level - only in person',
        TRUE,
        FALSE
    ),
    ('Course 999', 'inactive course', FALSE, FALSE);
INSERT INTO clients (client_name, business_unit)
VALUES ('Acme_Corp', 'Chemical Engineering'),
    ('Acme_Corp', 'Software Integration'),
    ('ABC Company', NULL),
    ('Financial Services', 'Accounting'),
    ('Financial Services', 'Investments');
INSERT INTO advisors (email, first_name, last_name)
VALUES ('john.doe@email.com', 'John', 'Doe'),
    ('henri@email.net', 'Henri', 'Bonaparte'),
    ('yusuke@tokyo.co.jp', 'Yusuke', 'Suzumura'),
    ('jorge@advisor.net', 'Jorge', 'Esteban');
INSERT INTO languages (advisor, advisor_language)
VALUES ('john.doe@email.com', 'English'),
    ('henri@email.net', 'English'),
    ('henri@email.net', 'French'),
    ('yusuke@tokyo.co.jp', 'Japanese'),
    ('yusuke@tokyo.co.jp', 'Chinese'),
    ('jorge@advisor.net', 'Spanish');
INSERT INTO regions (advisor, advisor_region)
VALUES ('john.doe@email.com', 'North America'),
    ('henri@email.net', 'EMEA'),
    ('henri@email.net', 'Africa'),
    ('yusuke@tokyo.co.jp', 'APAC'),
    ('yusuke@tokyo.co.jp', 'North America'),
    ('jorge@advisor.net', 'South America');
INSERT INTO unavailable_days (advisor, day_unavailable, note)
VALUES (
        'john.doe@email.com',
        '2021-10-22T01:00:00Z',
        'On Vacation'
    ),
    (
        'john.doe@email.com',
        '2021-10-23T01:00:00Z',
        'On Vacation'
    ),
    (
        'john.doe@email.com',
        '2021-10-24T01:00:00Z',
        'On Vacation'
    ),
    (
        'john.doe@email.com',
        '2021-10-25T01:00:00Z',
        'On Vacation'
    ),
    ('henri@email.net', '2021-06-22T01:00:00Z', NULL),
    ('henri@email.net', '2021-12-25T01:00:00Z', NULL),
    (
        'yusuke@tokyo.co.jp',
        '2021-11-30T01:00:00Z',
        'May be unavailable - best to avoid this date'
    );
INSERT INTO workshops (
        course_type,
        requested_advisor,
        backup_requested_advisor,
        assigned_advisor,
        workshop_location,
        client,
        open_air_id,
        time_zone,
        workshop_language,
        record_attendance
    )
VALUES (
        'Course 101',
        'john.doe@email.com',
        'henri@email.net',
        'john.doe@email.com',
        'Zoom',
        1,
        'OPID23560h-jk',
        'EST',
        'English',
        TRUE
    ),
    (
        'Course 101',
        'henri@email.net',
        NULL,
        'henri@email.net',
        'Zoom',
        1,
        'OPID23560h-jk',
        'CET',
        'French',
        TRUE
    ),
    (
        'Course 101',
        'yusuke@tokyo.co.jp',
        NULL,
        'yusuke@tokyo.co.jp',
        'Teams',
        1,
        'OPID23560h-jk',
        'PT',
        'Japanese',
        TRUE
    ),
    (
        'Course 101',
        'henri@email.net',
        'john.doe@email.com',
        'john.doe@email.com',
        'Zoom',
        3,
        'OPID236789',
        'EST',
        'English',
        FALSE
    ),
    (
        'Course 301',
        'jorge@advisor.net',
        NULL,
        'jorge@advisor.net',
        'Sao Paulo, Brazil',
        4,
        'OPID23560h-jk',
        'EST',
        'Spanish',
        TRUE
    ),
    (
        'Course 201',
        'henri@email.net',
        'john.doe@email.com',
        'henri@email.net',
        'Zoom',
        5,
        'OPID2354688',
        'CET',
        'English',
        TRUE
    );
INSERT INTO workshop_sessions (
        workshop_id,
        date_and_time,
        duration_in_hours,
        zoom_link,
        session_status
    )
VALUES (
        1,
        '2021-7-22T08:00:00EST',
        2,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    (
        1,
        '2021-7-23T08:00:00EST',
        2,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    (
        1,
        '2021-7-24T08:00:00EST',
        2,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    (
        1,
        '2021-7-25T08:00:00EST',
        2,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    --
    (
        2,
        '2021-7-22T08:00:00CET',
        2,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    (
        2,
        '2021-7-23T08:00:00CET',
        2,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    (
        2,
        '2021-7-24T08:00:00CET',
        2,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    (
        2,
        '2021-7-25T08:00:00CET',
        2,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    --
    (
        3,
        '2021-8-01T08:00:00PST',
        2,
        'www.zoom.com/user/abcdef1234',
        'REQUESTED'
    ),
    (
        3,
        '2021-8-08T08:00:00PST',
        2,
        'www.zoom.com/user/abcdef1234',
        'REQUESTED'
    ),
    (
        3,
        '2021-8-15T08:00:00PST',
        2,
        'www.zoom.com/user/abcdef1234',
        'REQUESTED'
    ),
    (
        3,
        '2021-8-22T08:00:00PST',
        2,
        'www.zoom.com/user/abcdef1234',
        'REQUESTED'
    ),
    --
    (
        4,
        '2021-10-20T08:00:00EST',
        1.5,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    (
        4,
        '2021-10-22T08:00:00EST',
        1.5,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    (
        4,
        '2021-10-24T08:00:00EST',
        1.5,
        'www.zoom.com/user/abcdef1234',
        'HOLD A'
    ),
    (
        4,
        '2021-10-26T08:00:00EST',
        1.5,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    --
    (
        5,
        '2021-12-03T08:00:00EST',
        2,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    (
        5,
        '2021-12-10T08:00:00EST',
        2,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    (
        5,
        '2021-12-17T08:00:00EST',
        2,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    (
        5,
        '2021-12-24T08:00:00EST',
        2,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    --
    (
        6,
        '2021-11-03T14:00:00CET',
        2,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    (
        6,
        '2021-11-10T14:00:00CET',
        2,
        'www.zoom.com/user/abcdef1234',
        'REQUESTED'
    ),
    (
        6,
        '2021-11-17T14:30:00CET',
        2,
        'www.zoom.com/user/abcdef1234',
        'REQUESTED'
    ),
    (
        6,
        '2021-11-24T14:00:00CET',
        2,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    );
INSERT INTO workshop_notes (workshop_id, workshop_session_id, note)
VALUES (
        1,
        NULL,
        'Client has requested translation of XYZ materials'
    ),
    (
        2,
        6,
        'Managers John Doe and Jane Doe will be joining as observers'
    ),
    (
        2,
        7,
        'Participants Phil Lowe and Stacy Adams will be unavailable and joining workshop 3/ session 3 to make up for it'
    ),
    (
        3,
        11,
        'Phil Lowe and Stacy Adams will be joining from workshop 2, session 3'
    ),
    (
        6,
        NULL,
        'Client has requested previous template of training materials ABC be used'
    ),
    (
        6,
        21,
        'Head of Sales Andrea Slonik will be joining to observe process'
    );
INSERT INTO change_log (workshop, note, log_date)
VALUES (
        1,
        'workshop request created',
        '2020-11-15T11:23:00EST'
    ),
    (1, 'workshop assigned', '2020-11-17T15:44:00EST'),
    (
        2,
        'workshop request created',
        '2021-01-22T12:18:00EST'
    ),
    (2, 'workshop assigned', '2021-01-29T16:02:00EST'),
    (
        3,
        'workshop request created',
        '2021-02-03T09:01:00EST'
    ),
    (3, 'workshop assigned', '2021-02-10T12:56:00EST'),
    (
        4,
        'workshop request created',
        '2021-11-01T10:03:00EST'
    ),
    (4, 'workshop assigned', '2021-11-17T15:34:00EST'),
    (
        4,
        'session 3 timing conflict for client. Placed in Hold while gathering new dates',
        '2021-11-18T07:34:00EST'
    ),
    (
        5,
        'workshop request created',
        '2020-12-20T08:24:00EST'
    ),
    (5, 'workshop assigned', '2020-12-22T15:54:00EST'),
    (
        6,
        'workshop request created',
        '2021-03-24T09:39:00EST'
    ),
    (
        6,
        'session 1 and 4 confirmed, waiting for confirmation on 2 and 3',
        '2021-03-28T16:47:00EST'
    );
INSERT INTO managers (first_name, last_name, email, email_password)
VALUES (
        'Amy',
        'Firenzi',
        'amy.firenzi@company.net',
        'password123'
    ),
    (
        'Frank',
        'Low',
        'frank.low@company.net',
        'myunhashedpassword'
    ),
    (
        'Gina',
        'Haskell',
        'gina.haskell@company.net',
        'noonewillguess12345'
    );
INSERT INTO manager_assignments (workshop_id, manager, active)
VALUES (1, 'amy.firenzi@company.net', TRUE),
    (1, 'frank.low@company.net', TRUE),
    (2, 'amy.firenzi@company.net', TRUE),
    (2, 'frank.low@company.net', TRUE),
    (3, 'amy.firenzi@company.net', FALSE),
    (3, 'frank.low@company.net', TRUE),
    (4, 'gina.haskell@company.net', TRUE),
    (4, 'amy.firenzi@company.net', FALSE),
    (5, 'gina.haskell@company.net', TRUE),
    (5, 'frank.low@company.net', TRUE),
    (6, 'frank.low@company.net', TRUE),
    (6, 'amy.firenzi@company.net', TRUE),
    (6, 'gina.haskell@company.net', FALSE);