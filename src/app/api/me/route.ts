import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { authenticate } from "@/middleware/auth";

export async function GET() {
  try {
    await connectDB();

    const decoded =
      await authenticate();

    const user = await User.findById(
      decoded.userId
    ).select("-password");

    if (!user) {
      throw new Error("User not found");
    }

    return NextResponse.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
}