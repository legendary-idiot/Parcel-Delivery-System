import { IUser } from "./user.interface";
import { User } from "./user.model";

const createUser = async (userData: Partial<IUser>) => {
  // Validate User Data

  // Check if User Already Exists

  // Hash Password

  // Create User

  // Return User

  return {
    user: userData,
  };
};

export const UserService = {
  createUser,
};
