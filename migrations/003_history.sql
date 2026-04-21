CREATE TABLE IF NOT EXISTS play_history (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  station_uuid TEXT NOT NULL,
  station_name TEXT NOT NULL,
  station_url TEXT NOT NULL,
  played_at INTEGER NOT NULL
);
