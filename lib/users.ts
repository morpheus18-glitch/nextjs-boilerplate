import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export interface User {
  id: number
  username: string
  role: 'admin' | 'user'
  salt: string
  hash: string
}

async function hashPassword(password: string) {
  const crypto = await import('crypto')
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, 100_000, 64, 'sha512').toString('hex')
  return { salt, hash }
}

async function verify(password: string, salt: string, hash: string) {
  const crypto = await import('crypto')
  const testHash = crypto.pbkdf2Sync(password, salt, 100_000, 64, 'sha512').toString('hex')
  return testHash === hash
}

export async function findUser(username: string): Promise<User | null> {
  const rows = await sql`SELECT * FROM users WHERE username = ${username}` as unknown as User[]
  return rows[0] || null
}

export async function createUser(username: string, password: string, role: 'admin' | 'user') {
  const { salt, hash } = await hashPassword(password)
  await sql`INSERT INTO users (username, salt, hash, role) VALUES (${username}, ${salt}, ${hash}, ${role})`
}

export async function verifyUser(username: string, password: string): Promise<User | null> {
  const user = await findUser(username)
  if (!user) return null
  const valid = await verify(password, user.salt, user.hash)
  return valid ? user : null
}

export async function updatePassword(username: string, password: string) {
  const { salt, hash } = await hashPassword(password)
  await sql`UPDATE users SET salt = ${salt}, hash = ${hash} WHERE username = ${username}`
}

export async function updatePasswordById(id: number, password: string) {
  const { salt, hash } = await hashPassword(password)
  await sql`UPDATE users SET salt = ${salt}, hash = ${hash} WHERE id = ${id}`
}
