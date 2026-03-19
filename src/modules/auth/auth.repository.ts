import User from "@/models/User";

export async function findUserByEmail(email: string) {
  return User.findOne({ email }).select("+password");
}

export async function createUser(data: any) {
  return User.create(data);
}