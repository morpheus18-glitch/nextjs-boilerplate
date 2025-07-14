import fs from 'fs/promises'
import crypto from 'crypto'
import path from 'path'

const PASS_PATH = path.join(process.cwd(), 'password.secure.json')

// Hash password with salt using pbkdf2, return {salt, hash}
export async function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, 100_000, 64, 'sha512').toString('hex')
  return { salt, hash }
}

// Verify a password against stored hash+salt
export async function verifyPassword(password: string) {
  try {
    const { salt, hash } = JSON.parse(await fs.readFile(PASS_PATH, 'utf8'))
    const testHash = crypto.pbkdf2Sync(password, salt, 100_000, 64, 'sha512').toString('hex')
    return testHash === hash
  } catch (e) {
    return false
  }
}

// Save new password hash/salt to disk
export async function setPassword(password: string) {
  const data = await hashPassword(password)
  await fs.writeFile(PASS_PATH, JSON.stringify(data), 'utf8')
}

// Check if password is already set
export async function isPasswordSet() {
  try {
    await fs.access(PASS_PATH)
    return true
  } catch {
    return false
  }
}
