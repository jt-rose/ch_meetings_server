CREATE OR REPLACE FUNCTION trigger_set_timestamp() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER change_timestamp_on_update BEFORE
UPDATE ON courses FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
--
CREATE OR REPLACE FUNCTION trigger_update_time() RETURNS TRIGGER AS $$ BEGIN NEW.last_updated = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER change_available_license_time_on_update BEFORE
UPDATE ON available_licenses FOR EACH ROW EXECUTE PROCEDURE trigger_update_time();
CREATE TRIGGER change_reserved_license_time_on_update BEFORE
UPDATE ON reserved_licenses FOR EACH ROW EXECUTE PROCEDURE trigger_update_time();