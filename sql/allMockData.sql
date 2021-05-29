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
        client_id,
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
        'July 22 2021 12:00:00 GMT',
        2,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    (
        1,
        'July 23 2021 12:00:00 GMT',
        2,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    (
        1,
        'July 24 2021 12:00:00 GMT',
        2,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    (
        1,
        'July 25 2021 12:00:00 GMT',
        2,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    --
    (
        2,
        'July 22 2021 06:00:00 GMT',
        2,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    (
        2,
        'July 23 2021 06:00:00 GMT',
        2,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    (
        2,
        'July 24 2021 06:00:00 GMT',
        2,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    (
        2,
        'July 25 2021 06:00:00 GMT',
        2,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    --
    (
        3,
        NULL,
        2,
        'www.zoom.com/user/abcdef1234',
        'REQUESTED'
    ),
    (
        3,
        NULL,
        2,
        'www.zoom.com/user/abcdef1234',
        'REQUESTED'
    ),
    (
        3,
        NULL,
        2,
        'www.zoom.com/user/abcdef1234',
        'REQUESTED'
    ),
    (
        3,
        NULL,
        2,
        'www.zoom.com/user/abcdef1234',
        'REQUESTED'
    ),
    --
    (
        4,
        'Oct 20 2021 14:00:00 GMT',
        1.5,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    (
        4,
        'Oct 22 2021 14:00:00 GMT',
        1.5,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    (
        4,
        'Oct 24 2021 14:00:00 GMT',
        1.5,
        'www.zoom.com/user/abcdef1234',
        'HOLD A'
    ),
    (
        4,
        'Oct 26 2021 14:00:00 GMT',
        1.5,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    --
    (
        5,
        'Dec 03 2021 13:00:00 GMT',
        2,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    (
        5,
        'Dec 10 2021 13:00:00 GMT',
        2,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    (
        5,
        'Dec 17 2021 13:00:00 GMT',
        2,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    (
        5,
        'Dec 24 2021 11:00:00 GMT',
        2,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    --
    (
        6,
        'Nov 03 2021 12:00:00 GMT',
        2,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    (
        6,
        NULL,
        2,
        'www.zoom.com/user/abcdef1234',
        'REQUESTED'
    ),
    (
        6,
        NULL,
        2,
        'www.zoom.com/user/abcdef1234',
        'REQUESTED'
    ),
    (
        6,
        'Nov 24 2021 12:00:00 GMT',
        2,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    );
INSERT INTO requested_start_times (
        workshop_session_id,
        earliest_start_time,
        latest_start_time
    )
VALUES -- workshop 1 sessions
    (
        1,
        'July 22 2021 12:00:00 GMT',
        'July 22 2021 12:00:00 GMT'
    ),
    (
        2,
        'July 23 2021 12:00:00 GMT',
        'July 23 2021 12:00:00 GMT'
    ),
    (
        3,
        'July 24 2021 12:00:00 GMT',
        'July 24 2021 12:00:00 GMT'
    ),
    (
        4,
        'July 25 2021 12:00:00 GMT',
        'July 25 2021 12:00:00 GMT'
    ),
    -- workshop 2 sessions
    (
        5,
        'July 22 2021 06:00:00 GMT',
        'July 22 2021 09:00:00 GMT'
    ),
    (
        6,
        'July 23 2021 06:00:00 GMT',
        'July 23 2021 09:00:00 GMT'
    ),
    (
        7,
        'July 24 2021 06:00:00 GMT',
        'July 24 2021 09:00:00 GMT'
    ),
    (
        8,
        'July 25 2021 06:00:00 GMT',
        'July 25 2021 09:00:00 GMT'
    ),
    -- workshop 3 sessions -Requested
    (
        9,
        'Aug 01 2021 07:00:00 GMT',
        'Aug 02 2021 6:59:59 GMT'
    ),
    (
        10,
        'Aug 08 2021 07:00:00 GMT',
        'Aug 09 2021 6:59:59 GMT'
    ),
    (
        11,
        'Aug 15 2021 07:00:00 GMT',
        'Aug 16 2021 6:59:59 GMT'
    ),
    (
        12,
        'Aug 22 2021 07:00:00 GMT',
        'Aug 23 2021 6:59:59 GMT'
    ),
    -- workshop 4 sessions - Hold A on 15
    (
        13,
        'Oct 20 2021 12:00:00 GMT',
        'Oct 20 2021 12:00:00 GMT'
    ),
    (
        14,
        'Oct 22 2021 12:00:00 GMT',
        'Oct 22 2021 12:00:00 GMT'
    ),
    (
        15,
        'Oct 24 2021 12:00:00 GMT',
        'Oct 24 2021 12:00:00 GMT'
    ),
    (
        15,
        'Oct 25 2021 12:00:00 GMT',
        'Oct 25 2021 12:00:00 GMT'
    ),
    (
        15,
        'Oct 25 2021 16:00:00 GMT',
        'Oct 25 2021 16:00:00 GMT'
    ),
    (
        16,
        'Oct 26 2021 12:00:00 GMT',
        'Oct 26 2021 12:00:00 GMT'
    ),
    -- workshop 5 sessions
    (
        17,
        'Dec 03 2021 10:00:00 GMT',
        'Dec 03 2021 15:00:00 GMT'
    ),
    (
        18,
        'Dec 10 2021 10:00:00 GMT',
        'Dec 10 2021 15:00:00 GMT'
    ),
    (
        19,
        'Dec 17 2021 10:00:00 GMT',
        'Dec 17 2021 15:00:00 GMT'
    ),
    (
        20,
        'Dec 24 2021 10:00:00 GMT',
        'Dec 24 2021 15:00:00 GMT'
    ),
    -- workshop 6 sessions - 22 and 23 Requested
    (
        21,
        'Nov 03 2021 12:00:00 GMT',
        'Nov 03 2021 12:00:00 GMT'
    ),
    (
        22,
        'Nov 10 2021 12:00:00 GMT',
        'Nov 10 2021 12:00:00 GMT'
    ),
    (
        22,
        'Nov 10 2021 14:00:00 GMT',
        'Nov 10 2021 14:00:00 GMT'
    ),
    (
        23,
        'Nov 17 2021 12:30:00 GMT',
        'Nov 17 2021 12:30:00 GMT'
    ),
    (
        23,
        'Nov 10 2021 14:30:00 GMT',
        'Nov 10 2021 14:30:00 GMT'
    ),
    (
        24,
        'Nov 24 2021 12:00:00 GMT',
        'Nov 24 2021 12:00:00 GMT'
    );
INSERT INTO workshop_notes (workshop_id, note)
VALUES (
        1,
        'Client has requested translation of XYZ materials'
    ),
    (
        6,
        'Client has requested previous template of training materials ABC be used'
    );
INSERT INTO session_notes (workshop_session_id, note)
VALUES (
        6,
        'Managers John Doe and Jane Doe will be joining as observers'
    ),
    (
        7,
        'Participants Phil Lowe and Stacy Adams will be unavailable and joining workshop 3/ session 3 to make up for it'
    ),
    (
        11,
        'Phil Lowe and Stacy Adams will be joining from workshop 2, session 3'
    ),
    (
        21,
        'Head of Sales Andrea Slonik will be joining to observe process'
    );
INSERT INTO change_log (workshop, note, log_date)
VALUES (
        1,
        'workshop request created',
        'Nov 15 2020 15:23:00 GMT'
    ),
    (
        1,
        'workshop assigned',
        'Nov 17 2020 17:44:00 GMT'
    ),
    (
        2,
        'workshop request created',
        'Jan 12 2021 15:23:00 GMT'
    ),
    (
        2,
        'workshop assigned',
        'Jan 29 2021 15:23:00 GMT'
    ),
    (
        3,
        'workshop request created',
        'Feb 03 2021 13:01:00 GMT'
    ),
    (
        3,
        'workshop assigned',
        'Feb 10 2021 16:56:00 GMT'
    ),
    (
        4,
        'workshop request created',
        'Nov 01 2020 14:03:00 GMT'
    ),
    (
        4,
        'workshop assigned',
        'Nov 17 2020 16:16:00 GMT'
    ),
    (
        4,
        'session 3 timing conflict for client. Placed in Hold while gathering new dates',
        'Nov 18 2020 11:34:00 GMT'
    ),
    (
        5,
        'workshop request created',
        'Dec 20 2020 12:24:00 GMT'
    ),
    (
        5,
        'workshop assigned',
        'Dec 22 2020 18:24:00 GMT'
    ),
    (
        6,
        'workshop request created',
        'Mar 03 2021 13:39:00 GMT'
    ),
    (
        6,
        'session 1 and 4 confirmed, waiting for confirmation on 2 and 3',
        'Mar 28 2021 20:47:00 GMT'
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