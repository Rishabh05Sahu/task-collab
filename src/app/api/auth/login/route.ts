import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { loginSchema } from "@/modules/auth/auth.schema";
import { loginUser } from "@/modules/auth/auth.service";
import { authRateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    await connectDB();

    const ip =
      req.headers.get("x-forwarded-for") ??
      "anonymous";

    const { success } =
      await authRateLimit.limit(ip);

    if (!success) {
      return NextResponse.json(
        {
          error:
            "Too many login attempts",
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed =
      loginSchema.parse(body);

    const { user, token } =
      await loginUser(parsed);

    const response =
      NextResponse.json(
        {
          success: true,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        },
        { status: 200 }
      );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure:
        process.env.NODE_ENV ===
        "production",
      sameSite: "strict",
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      {
        error:
          error.message ||
          "Invalid credentials",
      },
      { status: 401 }
    );
  }
}