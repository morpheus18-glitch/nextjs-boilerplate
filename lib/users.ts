import { neon } from '@neondatabase/serverless'
import crypto from 'crypto'

const sql = neon(process.env.DATABASE_URL!)

let initPromise: Promise<void> | null = null

async function setup() {
  await sql`CREATE TABLE IF NOT EXISTS users (
    id serial PRIMARY KEY,
    username text UNIQUE NOT NULL,
    salt text NOT NULL,
    hash text NOT NULL,
    role text NOT NULL
  )`
  const rows = await sql`SELECT id FROM users WHERE username = 'admin'` as { id: number }[]
  if (rows.length === 0) {
    const { salt, hash } = hashPassword('Admin@123')
    await sql`INSERT INTO users (username, salt, hash, role) VALUES ('admin', ${salt}, ${hash}, 'admin')`
  }
}

async function ensureSetup() {
  if (!initPromise) initPromise = setup()
  await initPromise
}

export interface User {
  id: number
  username: string
  role: 'admin' | 'user'
  salt: string
  hash: string
}

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, 100_000, 64, 'sha512').toString('hex')
  return { salt, hash }
}

export function verifyPassword(password: string, salt: string, hash: string) {
  const testHash = crypto.pbkdf2Sync(password, salt, 100_000, 64, 'sha512').toString('hex')
  return testHash === hash
}

export async function findUser(username: string): Promise<User | null> {
  await ensureSetup()
  const rows = await sql`SELECT * FROM users WHERE username = ${username}` as unknown as User[]
  return rows[0] || null
}

export async function createUser(username: string, password: string, role: 'admin' | 'user') {
  await ensureSetup()
  const { salt, hash } = hashPassword(password)
  await sql`INSERT INTO users (username, salt, hash, role) VALUES (${username}, ${salt}, ${hash}, ${role})`
}

export async function verifyUser(username: string, password: string): Promise<User | null> {
  await ensureSetup()
  const user = await findUser(username)
  if (!user) return null
  const valid = verifyPassword(password, user.salt, user.hash)
  return valid ? user : null
}

export async function updatePassword(username: string, password: string) {
  await ensureSetup()
  const { salt, hash } = hashPassword(password)
  await sql`UPDATE users SET salt = ${salt}, hash = ${hash} WHERE username = ${username}`
}

export async function updatePasswordById(id: number, password: string) {
  await ensureSetup()
  const { salt, hash } = hashPassword(password)
  await sql`UPDATE users SET salt = ${salt}, hash = ${hash} WHERE id = ${id}`
}
