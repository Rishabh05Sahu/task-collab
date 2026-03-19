import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });

  // Clear JWT cookie
  res.cookies.set("token", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });

  return res;
}