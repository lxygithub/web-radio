import type { D1Database } from "@cloudflare/workers-types";
import type { User } from "@/types/station";

// D1 database access - abstracted for easy migration
let db: D1Database | null = null;

export function getDB(): D1Database | null {
  return db;
}

export function initDB(database: D1Database) {
  db = database;
}

// User operations
export async function findUserByUsername(
  username: string
): Promise<User | null> {
  if (!db) return null;
  const result = await db
    .prepare("SELECT id, username, email, created_at FROM users WHERE username = ?")
    .bind(username)
    .first<User>();
  return result || null;
}

export async function findUserByEmail(email: string): Promise<User | null> {
  if (!db) return null;
  const result = await db
    .prepare("SELECT id, username, email, created_at FROM users WHERE email = ?")
    .bind(email)
    .first<User>();
  return result || null;
}

export async function getUserPasswordHash(userId: string): Promise<string | null> {
  if (!db) return null;
  const result = await db
    .prepare("SELECT password_hash FROM users WHERE id = ?")
    .bind(userId)
    .first<{ password_hash: string }>();
  return result?.password_hash || null;
}

export async function createUser(
  id: string,
  username: string,
  email: string,
  passwordHash: string,
  createdAt: number
): Promise<boolean> {
  if (!db) return false;
  const result = await db
    .prepare(
      "INSERT INTO users (id, username, email, password_hash, created_at) VALUES (?, ?, ?, ?, ?)"
    )
    .bind(id, username, email, passwordHash, createdAt)
    .run();
  return result.success;
}

// Favorites operations
export async function getFavorites(userId: string) {
  if (!db) return [];
  const results = await db
    .prepare(
      "SELECT id, station_uuid, station_name, station_url, station_favicon, created_at FROM favorites WHERE user_id = ? ORDER BY created_at DESC"
    )
    .bind(userId)
    .all();
  return results.results || [];
}

export async function addFavorite(
  id: string,
  userId: string,
  stationUuid: string,
  stationName: string,
  stationUrl: string,
  stationFavicon: string | null,
  createdAt: number
): Promise<boolean> {
  if (!db) return false;
  const result = await db
    .prepare(
      "INSERT OR IGNORE INTO favorites (id, user_id, station_uuid, station_name, station_url, station_favicon, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
    )
    .bind(id, userId, stationUuid, stationName, stationUrl, stationFavicon, createdAt)
    .run();
  return result.success;
}

export async function removeFavorite(userId: string, stationUuid: string): Promise<boolean> {
  if (!db) return false;
  const result = await db
    .prepare("DELETE FROM favorites WHERE user_id = ? AND station_uuid = ?")
    .bind(userId, stationUuid)
    .run();
  return result.success;
}

// History operations
export async function getHistory(userId: string, limit = 50) {
  if (!db) return [];
  const results = await db
    .prepare(
      "SELECT id, station_uuid, station_name, station_url, played_at FROM play_history WHERE user_id = ? ORDER BY played_at DESC LIMIT ?"
    )
    .bind(userId, limit)
    .all();
  return results.results || [];
}

export async function addHistory(
  id: string,
  userId: string,
  stationUuid: string,
  stationName: string,
  stationUrl: string,
  playedAt: number
): Promise<boolean> {
  if (!db) return false;
  const result = await db
    .prepare(
      "INSERT INTO play_history (id, user_id, station_uuid, station_name, station_url, played_at) VALUES (?, ?, ?, ?, ?, ?)"
    )
    .bind(id, userId, stationUuid, stationName, stationUrl, playedAt)
    .run();
  return result.success;
}
