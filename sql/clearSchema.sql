-- script for ending background processes and clearing the schema
-- used when resetting schema
SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE pg_stat_activity.datname = 'ch_meetings'
    AND pid <> pg_backend_pid();
DROP SCHEMA "public" CASCADE;
CREATE SCHEMA "public";