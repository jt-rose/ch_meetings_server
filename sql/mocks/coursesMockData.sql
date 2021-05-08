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
    ('Course 999', 'inactive course', FALSE, FALSE)