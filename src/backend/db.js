import Database from "better-sqlite3";
const db = new Database("playnine.sqlite");

// Create a lobbies table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS lobbies (
    code TEXT PRIMARY KEY,    -- Lobby code (6-digit uuid)
    host TEXT,                -- Socket ID
    players TEXT,             -- JSON stringified array of Names and Socket IDs
    state TEXT,               -- JSON for game state (cards, scores, etc.)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );`);

export default db;
