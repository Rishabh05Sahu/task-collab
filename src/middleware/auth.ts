import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function authenticate() {
  const cookieStore =
    await cookies();

  const token =
    cookieStore.get("token")?.value;

  if (!token) {
    const error: any =
      new Error("Unauthorized");
    error.status = 401;
    throw error;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as {
      userId: string;
      role: "user" | "admin";
    };

    return decoded;
  } catch {
    const error: any =
      new Error("Unauthorized");
    error.status = 401;
    throw error;
  }
}