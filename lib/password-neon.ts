import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function setPassword(password: string) {
  const crypto = await import("crypto");
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 100_000, 64, "sha512").toString("hex");
  const rows = await sql`SELECT id FROM admin_password WHERE id = 1`;
  if (rows.length) {
    await sql`UPDATE admin_password SET salt = ${salt}, hash = ${hash} WHERE id = 1`;
  } else {
    await sql`INSERT INTO admin_password (id, salt, hash) VALUES (1, ${salt}, ${hash})`;
  }
}

export async function verifyPassword(password: string) {
  const crypto = await import("crypto");
  const rows = await sql`SELECT salt, hash FROM admin_password WHERE id = 1`;
  if (!rows.length) return false;
  const { salt, hash } = rows[0];
  const testHash = crypto.pbkdf2Sync(password, salt, 100_000, 64, "sha512").toString("hex");
  return testHash === hash;
}