-- One check-in per client + coach + calendar day.
-- Existing data was checked for duplicate logical keys before this migration.
ALTER TABLE fitness.progress_records
  ADD COLUMN IF NOT EXISTS log_date date;

-- Store step dates in the app's Asia/Manila calendar, independent of UTC date boundaries.
UPDATE fitness.progress_records
SET log_date = (recorded_at AT TIME ZONE 'Asia/Manila')::date
WHERE record_type = 'steps' AND log_date IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_check_ins_client_coach_due_date
  ON fitness.check_ins (client_id, coach_id, due_date);

-- Non-step progress rows keep log_date NULL, so the unique index only constrains dated step records.
CREATE UNIQUE INDEX IF NOT EXISTS uq_progress_records_client_log_date
  ON fitness.progress_records (client_id, log_date);

CREATE INDEX IF NOT EXISTS idx_notifications_user_unread_created
  ON fitness.notifications (user_id, is_read, created_at DESC);
