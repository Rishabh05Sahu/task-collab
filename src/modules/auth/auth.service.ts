import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function loginUser(data: {
  email: string;
  password: string;
}) {
  const { email, password } = data;

  const user = await User.findOne({
    email,
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    {
      userId: user._id.toString(),
      role: user.role,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  return { user, token };
}