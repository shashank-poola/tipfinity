DROP TABLE  activity_logs;
DROP TABLE tips;
DROP TABLE creators;

-- Re-add the display_name column if we rollback
ALTER TABLE creators ADD COLUMN display_name VARCHAR(100);
