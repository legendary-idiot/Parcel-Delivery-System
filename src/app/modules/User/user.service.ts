import { IUser } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcryptjs";
import AppError from "../../errorHelpers/customError";

const createUser = async (userData: Partial<IUser>) => {
  // Check if User Already Exists
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new AppError(400, "User already exists with this email");
  }

  // Hash Password
  const saltRounds: number = Number(process.env.SALT_ROUND);
  const hashedPassword = await bcrypt.hash(userData.password!, saltRounds);

  // Create User
  const newUser = await User.create({
    ...userData,
    password: hashedPassword,
  });

  // Return User (without password)
  const { password, ...userWithoutPassword } = newUser.toObject();

  return {
    user: userWithoutPassword,
  };
};

export const UserService = {
  createUser,
};
