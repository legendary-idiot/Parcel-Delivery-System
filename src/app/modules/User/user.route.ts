import express from "express";
import { UserController } from "./user.controller";
import { userDataValidation } from "../../middlewares/userDataValidation";
import { createUserValidation } from "./user.validation";

const router = express.Router();

// Create User
router.post(
  "/create-user",
  userDataValidation(createUserValidation),
  UserController.createUser
);

export const UserRoutes = router;
