import { User } from "../User/user.model";
import { createAccessToken } from "../../utils/generateToken";
import AppError from "../../errorHelpers/customError";
import { ActiveStatus } from "../User/user.interface";
import bcrypt from "bcryptjs";

export const loginUser = async (email: string, password: string) => {
  // Find user by email
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new AppError(401, "Invalid email or password");
  }

  // Check if user is active
  if (user.isActive !== ActiveStatus.Active) {
    throw new AppError(403, `Your account is ${user.isActive.toLowerCase()}`);
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError(401, "Invalid email or password");
  }

  // Generate tokens
  const { accessToken, refreshToken } = createAccessToken(user);

  // Return user data without password
  const { password: _, ...userWithoutPassword } = user.toObject();

  return {
    user: userWithoutPassword,
    accessToken,
    refreshToken,
  };
};

export const AuthService = {
  loginUser,
};
