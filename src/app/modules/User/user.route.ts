import express, { Request, Response } from "express";
import { UserController } from "./user.controller";
import { inputDataValidation } from "../../middlewares/inputDataValidation";
import { createUserValidation, updateUserValidation } from "./user.validation";
import checkAuth from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const router = express.Router();

// Create User
router.post(
  "/create-user",
  inputDataValidation(createUserValidation),
  UserController.createUser
);

// Update User
router.patch(
  "/update/:userId",
  checkAuth(...Object.values(Role)),
  inputDataValidation(updateUserValidation),
  UserController.updateUser
);

// Get All Users
router.get(
  "/all-users",
  checkAuth(Role.SuperAdmin),
  UserController.getAllUsers
);

// Get Single User
router.get(
  "/:userId",
  checkAuth(...Object.values(Role)),
  UserController.getSingleUser
);

// Delete User
router.delete(
  "/delete/:userId",
  checkAuth(Role.SuperAdmin, Role.User),
  UserController.deleteUser
);

export const UserRoutes = router;
