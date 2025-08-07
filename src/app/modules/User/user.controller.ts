import { Request, Response } from "express";
import { UserService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  const userData = req.body;
  const result = await UserService.createUser(userData);

  res.status(200).json({
    success: true,
    message: "User created successfully",
    // data: result,
  });
};

export const UserController = {
  createUser,
};
