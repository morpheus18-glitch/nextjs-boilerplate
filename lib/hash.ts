import crypto from 'crypto'

export function hashPassword(password: string, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
  return { salt, hash }
}

export function verifyPassword(password: string, originalHash: string, salt: string): boolean {
  const { hash } = hashPassword(password, salt)
  return hash === originalHash
}