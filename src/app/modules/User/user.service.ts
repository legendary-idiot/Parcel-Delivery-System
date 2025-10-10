import { ActiveStatus, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcryptjs";
import AppError from "../../errorHelpers/customError";
import { JwtPayload } from "jsonwebtoken";

// Create new user
const createUser = async (userData: Partial<IUser>) => {
  // Check if User Already Exists
  const userExist = await User.findOne({ email: userData.email });
  if (userExist) {
    throw new AppError(400, "User already exists with this email");
  }

  // Ensure role cannot be set to Admin or Super Admin during user creation
  if (userData.role === Role.Admin || userData.role === Role.SuperAdmin) {
    throw new AppError(403, "Cannot assign Admin or SuperAdmin role");
  }

  // Hash Password
  const saltRounds: number = Number(process.env.SALT_ROUND);
  const hashedPassword = await bcrypt.hash(userData.password!, saltRounds);

  // Register User in the DB
  const newUser = await User.create({
    ...userData,
    password: hashedPassword,
  });

  // Return User Data without password
  const { password, ...userWithoutPassword } = newUser.toObject();

  return {
    user: userWithoutPassword,
  };
};

// Update user data
const updateUser = async (
  userId: string,
  tokenPayload: JwtPayload,
  updatedData: Partial<IUser>
) => {
  // Only allow users to update their own profile unless they are SuperAdmin
  if (
    tokenPayload.userId !== userId &&
    !(tokenPayload.role === Role.SuperAdmin)
  ) {
    throw new AppError(403, "You can only update your own profile");
  }

  // Check if user exists
  const userExist = await User.findById(userId);
  if (!userExist) {
    throw new AppError(404, "User not found");
  }

  // Prevent role changes to Admin or SuperAdmin through this method
  if (updatedData.role === Role.Admin || updatedData.role === Role.SuperAdmin) {
    throw new AppError(403, "Cannot assign Admin or Super Admin role");
  }

  // Prevent update email to an email that already exists
  if (updatedData.email && updatedData.email !== userExist.email) {
    const emailTaken = await User.findOne({ email: updatedData.email });
    if (emailTaken) {
      throw new AppError(400, "Email is already in use");
    }
  }

  // Only Super Admin can change active status
  if (updatedData.isActive && tokenPayload.role !== Role.SuperAdmin) {
    throw new AppError(403, "Only Super Admin can change Active status");
  }

  // If password is being updated, hash the new password
  if (updatedData.password) {
    const saltRounds: number = Number(process.env.SALT_ROUND);
    updatedData.password = await bcrypt.hash(updatedData.password, saltRounds);
  }
  const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    throw new AppError(404, "User not found");
  }

  // Return updated user (without password)
  const { password, ...userWithoutPassword } = updatedUser.toObject();

  return {
    user: userWithoutPassword,
  };
};

// Get single user by ID
const getSingleUser = async (userId: string) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new AppError(404, "User not found");
  }
  return user;
};

// Get all users
const getAllUsers = async () => {
  const users = await User.find().select("-password");
  return users;
};

// Delete user by ID
const deleteUser = async (userId: string) => {
  //Check User Existence
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new AppError(404, "User not found");
  }

  //Check if user is already inactive or blocked
  if (
    user.isActive === ActiveStatus.Inactive ||
    user.isActive === ActiveStatus.Blocked
  ) {
    throw new AppError(400, `This user is ${user.isActive}. Contact Admin`);
  }

  // Delete User by setting isActive status to Deleted
  user.isActive = ActiveStatus.Deleted;
  await user.save();
  return user;
};

export const UserService = {
  createUser,
  updateUser,
  getSingleUser,
  getAllUsers,
  deleteUser,
};
