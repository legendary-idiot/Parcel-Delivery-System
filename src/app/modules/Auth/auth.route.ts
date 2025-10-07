import { Router } from "express";
import { AuthController } from "./auth.controller";
import { inputDataValidation } from "../../middlewares/inputDataValidation";
import { loginValidation, logoutValidation } from "./auth.validation";

const router = Router();

// Login route with validation
router.post(
  "/login",
  inputDataValidation(loginValidation),
  AuthController.login
);

// Logout route with validation
router.post(
  "/logout",
  inputDataValidation(logoutValidation),
  AuthController.logout
);

export const AuthRoutes = router;
