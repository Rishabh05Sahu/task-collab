import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { registerSchema } from "@/modules/auth/auth.schema";
import { ZodError } from "zod";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    // Validates email + password (+ name) using Zod
    const parsed = registerSchema.parse(body);

    const { name, email, password } = parsed;

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 },
      );
    }

    // Bootstrap admin on first user
    const userCount = await User.countDocuments();
    const role = userCount === 0 ? "admin" : "user";

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
    );

    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 },
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return response;
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues.map((e) => e.message).join(", ") },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: error?.message || "Signup failed" },
      { status: 500 },
    );
  }
}
