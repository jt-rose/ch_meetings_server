CREATE OR REPLACE FUNCTION trigger_set_timestamp() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER change_timestamp_on_update BEFORE
UPDATE ON courses FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();