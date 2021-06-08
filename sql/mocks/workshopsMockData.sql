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