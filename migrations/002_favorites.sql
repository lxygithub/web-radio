CREATE TABLE IF NOT EXISTS favorites (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  station_uuid TEXT NOT NULL,
  station_name TEXT NOT NULL,
  station_url TEXT NOT NULL,
  station_favicon TEXT,
  created_at INTEGER NOT NULL,
  UNIQUE(user_id, station_uuid)
);
