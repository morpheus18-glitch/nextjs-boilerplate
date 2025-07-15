const { neon } = require('@neondatabase/serverless');
const crypto = require('crypto');

const sql = neon(process.env.DATABASE_URL);

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100_000, 64, 'sha512').toString('hex');
  return { salt, hash };
}

async function createTables() {
  await sql`CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL,
    salt TEXT NOT NULL,
    hash TEXT NOT NULL
  )`;

  await sql`CREATE TABLE IF NOT EXISTS reset_codes (
    username TEXT PRIMARY KEY REFERENCES users(username) ON DELETE CASCADE,
    code TEXT NOT NULL,
    expires TIMESTAMP NOT NULL
  )`;

  await sql`CREATE TABLE IF NOT EXISTS admin_password (
    id INTEGER PRIMARY KEY,
    salt TEXT NOT NULL,
    hash TEXT NOT NULL
  )`;
}

async function createInitialAdmin() {
  const username = process.env.INITIAL_ADMIN_USER;
  const password = process.env.INITIAL_ADMIN_PASSWORD;
  if (!username || !password) return;
  const { salt, hash } = await hashPassword(password);
  await sql`
    INSERT INTO users (username, salt, hash, role)
    VALUES (${username}, ${salt}, ${hash}, 'admin')
    ON CONFLICT (username) DO NOTHING
  `;
  console.log(`Ensured admin user '${username}' exists`);
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is required');
    process.exit(1);
  }
  await createTables();
  await createInitialAdmin();
  console.log('Database initialized');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
