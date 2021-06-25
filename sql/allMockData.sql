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
INSERT INTO coursework (
        coursework_id,
        coursework_name,
        coursework_description,
        active
    )
VALUES (
        1,
        'Intro Prework',
        'Foundation eLearning to introduce basic concepts. Recommended 2-4 weeks, before coursework.',
        TRUE
    ),
    (
        2,
        'Intro Postwork',
        'Reinforement exercises to be done after completing intro course. Recommended 2-4 weeks, after coursework.',
        TRUE
    ),
    (
        3,
        'Learn and Apply Intro Coursework',
        'Combined foundations introduction and reinforcement exercises. Recommended 4-8 weeks, before coursework.',
        TRUE
    ),
    (
        4,
        '201 prework',
        'Introduction to 201 concepts and quick refresher on 101 materials. Recommended 2-4 weeks.',
        TRUE
    ),
    (
        5,
        'OLD - 201 prework',
        'RETIRED - PLEASE USE THE CURRENT "201 prework"! Original description: Introduction to 201 concepts and quick refresher on 101 materials. Recommended 2-4 weeks.',
        FALSE
    ),
    (
        6,
        '301 prework',
        'Introduction to advanced 301 concepts, to be completed in conjunction with real-world work opportunities. Recommended 3-6 weeks.',
        TRUE
    );
INSERT INTO courses_and_coursework (
        course_and_coursework_id,
        course_id,
        coursework_id
    )
VALUES (1, 1, 1),
    (2, 1, 2),
    (3, 1, 3),
    (4, 2, 1),
    (5, 2, 2),
    (6, 2, 3),
    (7, 3, 4),
    (8, 4, 5);
INSERT INTO workshop_session_sets (
        session_set_id,
        course_id,
        session_name,
        session_order
    )
VALUES (1, 1, 'Orientation', 1),
    (2, 1, 'Managers Meeting', 2),
    (3, 1, 'Session 1', 3),
    (4, 1, 'Session 2', 4),
    (5, 1, 'Session 3', 5),
    (6, 1, 'Session 4', 6),
    (7, 1, 'Managers Meeting', 7),
    --
    (8, 2, 'Course 101 In-Person: Day 1', 1),
    (9, 2, 'Course 101 In-Person: Day 2', 2),
    --
    (10, 3, 'Orientation', 1),
    (11, 3, 'Session 1', 2),
    (12, 3, 'Session 2', 3),
    (13, 3, 'Session 3', 4),
    (14, 3, 'Session 4', 5),
    (15, 3, 'Managers Meeting', 6),
    --
    (16, 4, 'Master Class In-Person: Day 1', 1),
    (17, 4, 'Master Class In-Person: Day 2', 2);
INSERT INTO clients (client_id, client_name, business_unit, active)
VALUES (1, 'Acme_Corp', 'Chemical Engineering', TRUE),
    (2, 'Acme_Corp', 'Software Integration', TRUE),
    (3, 'ABC Company', NULL, TRUE),
    (4, 'Financial Services', 'Accounting', TRUE),
    (5, 'Financial Services', 'Investments', TRUE),
    (6, 'Med Clinique', NULL, FALSE);
INSERT INTO client_notes (client_id, note)
VALUES (
        1,
        '70% of 2021 licenses should be used before October 2021'
    ),
    (
        6,
        'program on hiatus as client undergoes acquisition by BioTech Inc.'
    );
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
        cohort_name,
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
        'NAM Cohort 1',
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
        'EMEA Cohort 1',
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
        'APAC Cohort 6',
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
        'NAM 2021 Training',
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
        'LATAM Follow-up Cohort 8SE',
        NULL,
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
        'EMEA Crossover Group B',
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
        'Canada Advance Team 2020-2021',
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
INSERT INTO workshop_coursework (
        workshop_coursework_id,
        workshop_id,
        coursework_id
    )
VALUES (1, 1, 1),
    (2, 1, 2),
    (3, 2, 1),
    (4, 2, 2),
    (5, 3, 3),
    (6, 4, 4),
    (7, 5, 5),
    (8, 6, 4),
    (9, 7, 3);
INSERT INTO workshop_sessions (
        workshop_session_id,
        session_name,
        workshop_id,
        date_and_time,
        duration_in_hours,
        zoom_link,
        session_status
    )
VALUES (
        1,
        'Orientation',
        1,
        'July 21 2021 11:00:00 GMT',
.5,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    (
        2,
        'Managers Meeting',
        1,
        'July 21 2021 12:00:00 GMT',
        1,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    (
        3,
        'Session 1',
        1,
        'July 22 2021 12:00:00 GMT',
        2,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    (
        4,
        'Session 2',
        1,
        'July 23 2021 12:00:00 GMT',
        2,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    (
        5,
        'Session 3',
        1,
        'July 24 2021 12:00:00 GMT',
        2,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    (
        6,
        'Session 4',
        1,
        'July 25 2021 12:00:00 GMT',
        2,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    (
        7,
        'Managers Meeting',
        1,
        'July 28 2021 11:00:00 GMT',
        1,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    --
    (
        8,
        'Orientation',
        2,
        'July 18 2021 6:00:00 GMT',
.5,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    (
        9,
        'Session 1',
        2,
        'July 22 2021 06:00:00 GMT',
        2,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    (
        10,
        'Session 2',
        2,
        'July 23 2021 06:00:00 GMT',
        2,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    (
        11,
        'Session 3',
        2,
        'July 24 2021 06:00:00 GMT',
        2,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    (
        12,
        'Session 4',
        2,
        'July 25 2021 06:00:00 GMT',
        2,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    --
    (
        13,
        'Foundational Concepts: Intro',
        3,
        NULL,
        2,
        'www.zoom.com/user/abcdef1234',
        'REQUESTED'
    ),
    (
        14,
        'Foundational Concepts: Explore Further',
        3,
        NULL,
        2,
        'www.zoom.com/user/abcdef1234',
        'REQUESTED'
    ),
    (
        15,
        'Foundational Concepts: Real-World Applications',
        3,
        NULL,
        2,
        'www.zoom.com/user/abcdef1234',
        'REQUESTED'
    ),
    (
        16,
        'Foundational Concepts: Summary & Recap',
        3,
        NULL,
        2,
        'www.zoom.com/user/abcdef1234',
        'REQUESTED'
    ),
    --
    (
        17,
        'Orientation',
        4,
        'Oct 19 2021 14:00:00 GMT',
.5,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    (
        18,
        'Session 1',
        4,
        'Oct 20 2021 14:00:00 GMT',
        1.5,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    (
        19,
        'Session 2',
        4,
        'Oct 22 2021 14:00:00 GMT',
        1.5,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    (
        20,
        'Session 3',
        4,
        'Oct 24 2021 14:00:00 GMT',
        1.5,
        'www.zoom.com/user/abcdef1234',
        'HOLD A'
    ),
    (
        21,
        'Session 4',
        4,
        'Oct 26 2021 14:00:00 GMT',
        1.5,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    (
        22,
        'Managers Meeting',
        4,
        'Oct 30 2021 14:00:00 GMT',
        1,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    --
    (
        23,
        'Session 1',
        5,
        'Dec 03 2021 13:00:00 GMT',
        2,
        'www.zoom.com/user/abcdef1234',
        'REQUESTED'
    ),
    (
        24,
        'Session 2',
        5,
        'Dec 10 2021 13:00:00 GMT',
        2,
        'www.zoom.com/user/abcdef1234',
        'REQUESTED'
    ),
    (
        25,
        'Session 3',
        5,
        'Dec 17 2021 13:00:00 GMT',
        2,
        'www.zoom.com/user/abcdef1234',
        'REQUESTED'
    ),
    (
        26,
        'Session 4',
        5,
        'Dec 24 2021 11:00:00 GMT',
        2,
        'www.zoom.com/user/abcdef1234',
        'REQUESTED'
    ),
    --
    (
        27,
        'Orientation',
        6,
        'Nov 01 2021 12:00:00 GMT',
.5,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    (
        28,
        'Managers Meeting',
        6,
        'Nov 02 2021 12:00:00 GMT',
        1,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    (
        29,
        'Part 1: Teach',
        6,
        'Nov 03 2021 12:00:00 GMT',
        2,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    (
        30,
        'Part 2: Tailor',
        6,
        NULL,
        2,
        'www.zoom.com/user/abcdef1234',
        'REQUESTED'
    ),
    (
        31,
        'Part 3: Take Control',
        6,
        NULL,
        2,
        'www.zoom.com/user/abcdef1234',
        'REQUESTED'
    ),
    (
        32,
        'Part 4: Constructive Tension',
        6,
        'Nov 24 2021 12:00:00 GMT',
        2,
        'www.zoom.com/user/abcdef1234',
        'SCHEDULED'
    ),
    (
        33,
        'Managers Meeting 2',
        6,
        'Nov 26 2021 12:00:00 GMT',
        1,
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
        'workshop location changed',
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
        email_password,
        user_type,
        active
    )
VALUES (
        1,
        'Amy',
        'Firenzi',
        'amy.firenzi@company.net',
        'Password123!',
        'ADMIN',
        TRUE
    ),
    (
        2,
        'Frank',
        'Low',
        'frank.low@company.net',
        'My@Password789',
        'USER',
        TRUE
    ),
    (
        3,
        'Gina',
        'Haskell',
        'gina.haskell@company.net',
        'NoOneWillGuess12345!',
        'USER',
        TRUE
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
INSERT INTO manager_clients (manager_client_id, manager_id, client_id, active)
VALUES (1, 1, 1, TRUE),
    (2, 2, 1, TRUE),
    (3, 3, 3, TRUE),
    (4, 1, 3, TRUE),
    (5, 3, 4, TRUE),
    (6, 2, 4, TRUE),
    (7, 2, 5, TRUE),
    (8, 1, 5, TRUE);
INSERT INTO licenses (client_id, course_id, remaining_amount)
VALUES (1, 1, 193),
    (1, 3, 35),
    (2, 1, 46),
    (3, 1, 78),
    (4, 1, 63),
    (4, 3, 20),
    (5, 2, 75),
    (5, 3, 15),
    (5, 4, 18),
    (6, 1, 0);
INSERT INTO license_changes (
        updated_amount amount_change,
        change_note,
        license_id,
        manager_id,
        workshop_id
    )
VALUES (
        220,
        220,
        'added to program',
        1,
        1,
        NULL
    ),
    (
        -23,
        197,
        'Completed workshop: Workshop-ID 1',
        1,
        1,
        1
    ),
    (
        35,
        35,
        'added to program',
        2,
        1,
        NULL
    ),
    (
        46,
        46,
        'added to program',
        3,
        1,
        NULL
    ),
    (
        78,
        78,
        'added to program',
        4,
        1,
        NULL
    ),
    (
        63,
        63,
        'added to program',
        5,
        1,
        NULL
    ),
    (
        20,
        20,
        'added to program',
        6,
        1,
        NULL
    ),
    (
        75,
        75,
        'added to program',
        7,
        1,
        NULL
    ),
    (
        15,
        15,
        'added to program',
        8,
        1,
        NULL
    ),
    (
        18,
        18,
        'added to program',
        9,
        1,
        NULL
    ),
    (
        100,
        100,
        'added to program',
        10,
        1,
        NULL
    ),
    (
        -100,
        0,
        'removed from program',
        10,
        1,
        NULL
    );