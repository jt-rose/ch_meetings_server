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