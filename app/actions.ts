"use server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function getData() {
  // Return a list of all users from the database
  const rows = await sql`SELECT id, username, role FROM users ORDER BY id`;
  return rows as { id: number; username: string; role: string }[];
}
