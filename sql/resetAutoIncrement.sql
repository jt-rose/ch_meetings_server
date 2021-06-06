-- ran into an issue where the DB auto-increment
-- for SERIAL columns was out of order after resetting
-- the data. This code reset it and solved the issue.

ALTER SEQUENCE courses_course_id_seq RESTART WITH 6;
ALTER SEQUENCE clients_client_id_seq RESTART WITH 6;