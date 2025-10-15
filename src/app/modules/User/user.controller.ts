import { Request, Response } from "express";
import { UserService } from "./user.service";
import { JwtPayload } from "jsonwebtoken";
import { asyncWrapper } from "../../utils/asyncWrapper";

const createUser = asyncWrapper(async (req: Request, res: Response) => {
  const userData = req.body;
  const result = await UserService.createUser(userData);

  res.status(200).json({
    success: true,
    message: "User created successfully",
    data: result,
  });
});

const updateUser = asyncWrapper(async (req: Request, res: Response) => {
  const updatedUserData = req.body;
  const tokenPayload = req.user as JwtPayload;
  const userId = req.params.userId;
  const result = await UserService.updateUser(
    userId,
    tokenPayload,
    updatedUserData
  );

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    data: result,
  });
});

// Get Single User
const getSingleUser = asyncWrapper(async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const tokenPayload = req.user as JwtPayload;

  // Allow users to fetch only their own data unless they are Admin or Super Admin
  if (
    userId !== tokenPayload.userId &&
    tokenPayload.role !== "Admin" &&
    tokenPayload.role !== "SuperAdmin"
  ) {
    return res.status(403).json({
      success: false,
      message: "Forbidden: You don't have permission to access this resource",
      data: null,
    });
  }
  const result = await UserService.getSingleUser(userId);

  res.status(200).json({
    success: true,
    message: "User retrieved successfully",
    data: result,
  });
});

// Get All Users
const getAllUsers = asyncWrapper(async (req: Request, res: Response) => {
  const result = await UserService.getAllUsers();

  res.status(200).json({
    success: true,
    message: "Users retrieved successfully",
    data: result,
  });
});

// Delete User
const deleteUser = asyncWrapper(async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const tokenPayload = req.user as JwtPayload;

  // Users can delete only their own account unless they are Super Admin
  if (userId !== tokenPayload.userId && tokenPayload.role !== "SuperAdmin") {
    return res.status(403).json({
      success: false,
      message: "Forbidden: You don't have permission to delete this user",
      data: null,
    });
  }

  const result = await UserService.deleteUser(userId);

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
    data: result,
  });
});

export const UserController = {
  createUser,
  updateUser,
  getSingleUser,
  getAllUsers,
  deleteUser,
};
