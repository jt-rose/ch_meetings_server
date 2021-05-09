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
        'Sap Paulo, Brazil',
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
    )