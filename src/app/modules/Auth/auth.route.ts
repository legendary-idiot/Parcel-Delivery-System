import { Router } from "express";
import { AuthController } from "./auth.controller";
import { userDataValidation } from "../../middlewares/userDataValidation";
import { loginValidation, logoutValidation } from "./auth.validation";

const router = Router();

// Login route with validation
router.post(
  "/login",
  userDataValidation(loginValidation),
  AuthController.login
);

// Logout route with validation
router.post(
  "/logout",
  userDataValidation(logoutValidation),
  AuthController.logout
);

export const AuthRoutes = router;
