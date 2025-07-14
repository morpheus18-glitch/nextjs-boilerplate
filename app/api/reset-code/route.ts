import { NextResponse } from "next/server";
import { setPassword } from "../../../lib/password-neon";

export async function POST(req: Request) {
  try {
    const { code, password } = await req.json();
    if (code !== "123456") {
      return NextResponse.json({ success: false, error: "Invalid code" });
    }
    if (!password || password.length < 6) {
      return NextResponse.json({ success: false, error: "Password too short" });
    }
    await setPassword(password);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Server error: " + String(err) }, { status: 500 });
  }
}