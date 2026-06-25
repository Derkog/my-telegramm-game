const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'users.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    username TEXT,
    photo_url TEXT,
    auth_date INTEGER,
    created_at TEXT DEFAULT (datetime('now'))
  )
`);

function upsertUser(user) {
  const stmt = db.prepare(`
    INSERT INTO users (id, first_name, last_name, username, photo_url, auth_date)
    VALUES (@id, @first_name, @last_name, @username, @photo_url, @auth_date)
    ON CONFLICT(id) DO UPDATE SET
      first_name = @first_name,
      last_name = @last_name,
      username = @username,
      photo_url = @photo_url,
      auth_date = @auth_date
  `);
  stmt.run(user);
}

module.exports = { db, upsertUser };
