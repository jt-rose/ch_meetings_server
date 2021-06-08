INSERT INTO courses (
        course_id,
        course_name,
        course_description,
        active,
        virtual_course
    )
VALUES (1, 'Course 101', 'the basics', TRUE, TRUE),
    (
        2,
        'Course 102 - In-Person',
        'the basics, but in person',
        TRUE,
        FALSE
    ),
    (
        3,
        'Course 201',
        'the intermediate level',
        TRUE,
        TRUE
    ),
    (
        4,
        'Course 301',
        'the advanced level - only in person',
        TRUE,
        FALSE
    ),
    (5, 'Course 999', 'inactive course', FALSE, FALSE);
INSERT INTO clients (client_id, client_name, business_unit)
VALUES (1, 'Acme_Corp', 'Chemical Engineering'),
    (2, 'Acme_Corp', 'Software Integration'),
    (3, 'ABC Company', NULL),
    (4, 'Financial Services', 'Accounting'),
    (5, 'Financial Services', 'Investments');
INSERT INTO advisors (advisor_id, email, first_name, last_name)
VALUES (1, 'john.doe@email.com', 'John', 'Doe'),
    (2, 'henri@email.net', 'Henri', 'Bonaparte'),
    (3, 'yusuke@tokyo.co.jp', 'Yusuke', 'Suzumura'),
    (4, 'jorge@advisor.net', 'Jorge', 'Esteban'),
    (
        5,
        'nathan.jameson@email.com',
        'Nathan',
        'Jameson'
    );
INSERT INTO languages (language_id, advisor_id, advisor_language)
VALUES (1, 1, 'English'),
    (2, 2, 'English'),
    (3, 2, 'French'),
    (4, 3, 'Japanese'),
    (5, 3, 'Chinese'),
    (6, 4, 'Spanish'),
    (7, 5, 'English'),
    (8, 5, 'Vietnamese');
INSERT INTO regions (region_id, advisor_id, advisor_region)
VALUES (1, 1, 'NAM'),
    (2, 2, 'EMEA'),
    (3, 2, 'NAM'),
    (4, 3, 'APAC'),
    (5, 3, 'NAM'),
    (6, 4, 'LATAM'),
    (7, 5, 'NAM'),
    (8, 5, 'APAC');
INSERT INTO unavailable_days (
        unavailable_id,
        advisor_id,
        day_unavailable,
        note
    )
VALUES (
        1,
        1,
        '2021-10-22T01:00:00Z',
        'On Vacation'
    ),
    (
        2,
        1,
        '2021-10-23T01:00:00Z',
        'On Vacation'
    ),
    (
        3,
        1,
        '2021-10-24T01:00:00Z',
        'On Vacation'
    ),
    (
        4,
        1,
        '2021-10-25T01:00:00Z',
        'On Vacation'
    ),
    (5, 2, '2021-06-22T01:00:00Z', NULL),
    (6, 2, '2021-12-25T01:00:00Z', NULL),
    (
        7,
        3,
        '2021-11-30T01:00:00Z',
        'May be unavailable - best to avoid this date'
    );
INSERT INTO advisor_notes (note_id, advisor_id, advisor_note)
VALUES (
        1,
        1,
        'Can travel to EMEA occasionally with 3+ months notice'
    ),
    (
        2,
        1,
        'Has partnered with Henri in developing training materials for EMEA cohorts'
    ),
    (
        3,
        5,
        'Regularly travels between US, Japan, and Vietnam'
    );
INSERT INTO workshops (
        workshop_id,
        course_id,
        requested_advisor_id,
        backup_requested_advisor_id,
        assigned_advisor_id,
        workshop_location,
        workshop_region,
        class_size,
        client_id,
        open_air_id,
        time_zone,
        workshop_language,
        record_attendance,
        deleted
    )
VALUES (
        1,
        1,
        1,
        2,
        1,
        'Zoom',
        'NAM',
        15,
        1,
        'OPID23560h-jk',
        'EST',
        'English',
        TRUE,
        FALSE
    ),
    (
        2,
        1,
        2,
        NULL,
        2,
        'Zoom',
        'EMEA',
        15,
        1,
        'OPID23560h-jk',
        'CET',
        'French',
        TRUE,
        FALSE
    ),
    (
        3,
        1,
        3,
        NULL,
        3,
        'Teams',
        'APAC',
        20,
        1,
        'OPID23560h-jk',
        'JST',
        'Japanese',
        TRUE,
        FALSE
    ),
    (
        4,
        1,
        2,
        1,
        1,
        'Zoom',
        'NAM',
        20,
        3,
        'OPID236789',
        'EST',
        'English',
        FALSE,
        FALSE
    ),
    (
        5,
        4,
        4,
        NULL,
        4,
        'Sao Paulo, Brazil',
        'LATAM',
        25,
        4,
        'OPID23560h-jk',
        'EST',
        'Spanish',
        TRUE,
        FALSE
    ),
    (
        6,
        3,
        2,
        1,
        2,
        'Zoom',
        'EMEA',
        25,
        5,
        'OPID2354688',
        'CET',
        'English',
        TRUE,
        FALSE
    ),
    (
        7,
        1,
        1,
        NULL,
        NULL,
        'Ontario',
        'NAM',
        18,
        1,
        'OPID123456',
        'EST',
        'English',
        FALSE,
        TRUE
    );
INSERT INTO workshop_sessions (
        workshop_session_id,
        workshop_id,
        date_and_time,
        duration_in_hours,
        zoom_link,
        session_status
    )
VALUES (
        1,
        1,
        'July 22 2021 12:00:00 GMT',
        2,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    (
        2,
        1,
        'July 23 2021 12:00:00 GMT',
        2,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    (
        3,
        1,
        'July 24 2021 12:00:00 GMT',
        2,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    (
        4,
        1,
        'July 25 2021 12:00:00 GMT',
        2,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    --
    (
        5,
        2,
        'July 22 2021 06:00:00 GMT',
        2,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    (
        6,
        2,
        'July 23 2021 06:00:00 GMT',
        2,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    (
        7,
        2,
        'July 24 2021 06:00:00 GMT',
        2,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    (
        8,
        2,
        'July 25 2021 06:00:00 GMT',
        2,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    --
    (
        9,
        3,
        NULL,
        2,
        'www.zoom.com/user/abcdef1234',
        'REQUESTED'
    ),
    (
        10,
        3,
        NULL,
        2,
        'www.zoom.com/user/abcdef1234',
        'REQUESTED'
    ),
    (
        11,
        3,
        NULL,
        2,
        'www.zoom.com/user/abcdef1234',
        'REQUESTED'
    ),
    (
        12,
        3,
        NULL,
        2,
        'www.zoom.com/user/abcdef1234',
        'REQUESTED'
    ),
    --
    (
        13,
        4,
        'Oct 20 2021 14:00:00 GMT',
        1.5,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    (
        14,
        4,
        'Oct 22 2021 14:00:00 GMT',
        1.5,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    (
        15,
        4,
        'Oct 24 2021 14:00:00 GMT',
        1.5,
        'www.zoom.com/user/abcdef1234',
        'HOLD A'
    ),
    (
        16,
        4,
        'Oct 26 2021 14:00:00 GMT',
        1.5,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    --
    (
        17,
        5,
        'Dec 03 2021 13:00:00 GMT',
        2,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    (
        18,
        5,
        'Dec 10 2021 13:00:00 GMT',
        2,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    (
        19,
        5,
        'Dec 17 2021 13:00:00 GMT',
        2,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    (
        20,
        5,
        'Dec 24 2021 11:00:00 GMT',
        2,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    --
    (
        21,
        6,
        'Nov 03 2021 12:00:00 GMT',
        2,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    (
        22,
        6,
        NULL,
        2,
        'www.zoom.com/user/abcdef1234',
        'REQUESTED'
    ),
    (
        23,
        6,
        NULL,
        2,
        'www.zoom.com/user/abcdef1234',
        'REQUESTED'
    ),
    (
        24,
        6,
        'Nov 24 2021 12:00:00 GMT',
        2,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    );
INSERT INTO requested_start_times (
        request_id,
        workshop_session_id,
        earliest_start_time,
        latest_start_time
    )
VALUES -- workshop 1 sessions
    (
        1,
        1,
        'July 22 2021 12:00:00 GMT',
        'July 22 2021 12:00:00 GMT'
    ),
    (
        2,
        2,
        'July 23 2021 12:00:00 GMT',
        'July 23 2021 12:00:00 GMT'
    ),
    (
        3,
        3,
        'July 24 2021 12:00:00 GMT',
        'July 24 2021 12:00:00 GMT'
    ),
    (
        4,
        4,
        'July 25 2021 12:00:00 GMT',
        'July 25 2021 12:00:00 GMT'
    ),
    -- workshop 2 sessions
    (
        5,
        5,
        'July 22 2021 06:00:00 GMT',
        'July 22 2021 09:00:00 GMT'
    ),
    (
        6,
        6,
        'July 23 2021 06:00:00 GMT',
        'July 23 2021 09:00:00 GMT'
    ),
    (
        7,
        7,
        'July 24 2021 06:00:00 GMT',
        'July 24 2021 09:00:00 GMT'
    ),
    (
        8,
        8,
        'July 25 2021 06:00:00 GMT',
        'July 25 2021 09:00:00 GMT'
    ),
    -- workshop 3 sessions -Requested
    (
        9,
        9,
        'Aug 01 2021 07:00:00 GMT',
        'Aug 02 2021 6:59:59 GMT'
    ),
    (
        10,
        10,
        'Aug 08 2021 07:00:00 GMT',
        'Aug 09 2021 6:59:59 GMT'
    ),
    (
        11,
        11,
        'Aug 15 2021 07:00:00 GMT',
        'Aug 16 2021 6:59:59 GMT'
    ),
    (
        12,
        12,
        'Aug 22 2021 07:00:00 GMT',
        'Aug 23 2021 6:59:59 GMT'
    ),
    -- workshop 4 sessions - Hold A on 15
    (
        13,
        13,
        'Oct 20 2021 12:00:00 GMT',
        'Oct 20 2021 12:00:00 GMT'
    ),
    (
        14,
        14,
        'Oct 22 2021 12:00:00 GMT',
        'Oct 22 2021 12:00:00 GMT'
    ),
    (
        15,
        15,
        'Oct 24 2021 12:00:00 GMT',
        'Oct 24 2021 12:00:00 GMT'
    ),
    (
        16,
        15,
        'Oct 25 2021 12:00:00 GMT',
        'Oct 25 2021 12:00:00 GMT'
    ),
    (
        17,
        15,
        'Oct 25 2021 16:00:00 GMT',
        'Oct 25 2021 16:00:00 GMT'
    ),
    (
        18,
        16,
        'Oct 26 2021 12:00:00 GMT',
        'Oct 26 2021 12:00:00 GMT'
    ),
    -- workshop 5 sessions
    (
        19,
        17,
        'Dec 03 2021 10:00:00 GMT',
        'Dec 03 2021 15:00:00 GMT'
    ),
    (
        20,
        18,
        'Dec 10 2021 10:00:00 GMT',
        'Dec 10 2021 15:00:00 GMT'
    ),
    (
        21,
        19,
        'Dec 17 2021 10:00:00 GMT',
        'Dec 17 2021 15:00:00 GMT'
    ),
    (
        22,
        20,
        'Dec 24 2021 10:00:00 GMT',
        'Dec 24 2021 15:00:00 GMT'
    ),
    -- workshop 6 sessions - 22 and 23 Requested
    (
        23,
        21,
        'Nov 03 2021 12:00:00 GMT',
        'Nov 03 2021 12:00:00 GMT'
    ),
    (
        24,
        22,
        'Nov 10 2021 12:00:00 GMT',
        'Nov 10 2021 12:00:00 GMT'
    ),
    (
        25,
        22,
        'Nov 10 2021 14:00:00 GMT',
        'Nov 10 2021 14:00:00 GMT'
    ),
    (
        26,
        23,
        'Nov 17 2021 12:30:00 GMT',
        'Nov 17 2021 12:30:00 GMT'
    ),
    (
        27,
        23,
        'Nov 10 2021 14:30:00 GMT',
        'Nov 10 2021 14:30:00 GMT'
    ),
    (
        28,
        24,
        'Nov 24 2021 12:00:00 GMT',
        'Nov 24 2021 12:00:00 GMT'
    );
INSERT INTO workshop_notes (note_id, workshop_id, note)
VALUES (
        1,
        1,
        'Client has requested translation of XYZ materials'
    ),
    (
        2,
        6,
        'Client has requested previous template of training materials ABC be used'
    );
INSERT INTO session_notes (note_id, workshop_session_id, note)
VALUES (
        1,
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
        4,
        21,
        'Head of Sales Andrea Slonik will be joining to observe process'
    );
INSERT INTO change_log (log_id, workshop_id, note, log_date)
VALUES (
        1,
        1,
        'workshop request created',
        'Nov 15 2020 15:23:00 GMT'
    ),
    (
        2,
        1,
        'workshop assigned',
        'Nov 17 2020 17:44:00 GMT'
    ),
    (
        3,
        2,
        'workshop request created',
        'Jan 12 2021 15:23:00 GMT'
    ),
    (
        4,
        2,
        'workshop assigned',
        'Jan 29 2021 15:23:00 GMT'
    ),
    (
        5,
        3,
        'workshop request created',
        'Feb 03 2021 13:01:00 GMT'
    ),
    (
        6,
        3,
        'workshop assigned',
        'Feb 10 2021 16:56:00 GMT'
    ),
    (
        7,
        4,
        'workshop request created',
        'Nov 01 2020 14:03:00 GMT'
    ),
    (
        8,
        4,
        'workshop assigned',
        'Nov 17 2020 16:16:00 GMT'
    ),
    (
        9,
        4,
        'session 3 timing conflict for client. Placed in Hold while gathering new dates',
        'Nov 18 2020 11:34:00 GMT'
    ),
    (
        10,
        5,
        'workshop request created',
        'Dec 20 2020 12:24:00 GMT'
    ),
    (
        11,
        5,
        'workshop assigned',
        'Dec 22 2020 18:24:00 GMT'
    ),
    (
        12,
        6,
        'workshop request created',
        'Mar 03 2021 13:39:00 GMT'
    ),
    (
        13,
        6,
        'session 1 and 4 confirmed, waiting for confirmation on 2 and 3',
        'Mar 28 2021 20:47:00 GMT'
    );
INSERT INTO managers (
        manager_id,
        first_name,
        last_name,
        email,
        email_password
    )
VALUES (
        1,
        'Amy',
        'Firenzi',
        'amy.firenzi@company.net',
        'password123'
    ),
    (
        2,
        'Frank',
        'Low',
        'frank.low@company.net',
        'myunhashedpassword'
    ),
    (
        3,
        'Gina',
        'Haskell',
        'gina.haskell@company.net',
        'noonewillguess12345'
    );
INSERT INTO manager_assignments (
        assignment_id,
        workshop_id,
        manager_id,
        active
    )
VALUES (1, 1, 1, TRUE),
    (2, 1, 2, TRUE),
    (3, 2, 1, TRUE),
    (4, 2, 2, TRUE),
    (5, 3, 1, FALSE),
    (6, 3, 2, TRUE),
    (7, 4, 3, TRUE),
    (8, 4, 1, FALSE),
    (9, 5, 3, TRUE),
    (10, 5, 2, TRUE),
    (11, 6, 2, TRUE),
    (12, 6, 1, TRUE),
    (13, 6, 1, FALSE);