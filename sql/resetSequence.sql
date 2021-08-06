-- ran into an issue where the DB auto-increment
-- for SERIAL columns was out of order after resetting
-- the data. This code reset it and solved the issue.
ALTER SEQUENCE clients_client_id_seq RESTART WITH 1;
ALTER SEQUENCE client_notes_note_id_seq RESTART WITH 1;
ALTER SEQUENCE managers_manager_id_seq RESTART WITH 1;
ALTER SEQUENCE advisors_advisor_id_seq RESTART WITH 1;
ALTER SEQUENCE unavailable_days_unavailable_id_seq RESTART WITH 1;
ALTER SEQUENCE languages_language_id_seq RESTART WITH 1;
ALTER SEQUENCE regions_region_id_seq RESTART WITH 1;
ALTER SEQUENCE advisor_notes_note_id_seq RESTART WITH 1;
ALTER SEQUENCE courses_course_id_seq RESTART WITH 1;
ALTER SEQUENCE coursework_coursework_id_seq RESTART WITH 1;
ALTER SEQUENCE courses_and_coursework_course_and_coursework_id_seq RESTART WITH 1;
ALTER SEQUENCE workshops_workshop_id_seq RESTART WITH 1;
ALTER SEQUENCE workshop_coursework_workshop_coursework_id_seq RESTART WITH 1;
ALTER SEQUENCE workshop_session_sets_session_set_id_seq RESTART WITH 1;
ALTER SEQUENCE workshop_sessions_workshop_session_id_seq RESTART WITH 1;
ALTER SEQUENCE workshop_change_log_log_id_seq RESTART WITH 1;
ALTER SEQUENCE manager_assignments_assignment_id_seq RESTART WITH 1;
ALTER SEQUENCE manager_clients_manager_client_id_seq RESTART WITH 1;
ALTER SEQUENCE workshop_notes_note_id_seq RESTART WITH 1;
ALTER SEQUENCE available_licenses_license_id_seq RESTART WITH 1;
ALTER SEQUENCE reserved_licenses_reserved_license_id_seq RESTART WITH 1;
ALTER SEQUENCE license_changes_license_change_id_seq RESTART WITH 1;