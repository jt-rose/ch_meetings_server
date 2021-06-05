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