import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { setCookie, clearCookie } from "../../utils/setCookie";

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await AuthService.loginUser(email, password);

  // Set cookies for tokens
  setCookie(res, "accessToken", result.accessToken, {
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  setCookie(res, "refreshToken", result.refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      user: result.user,
    },
  });
};

const logout = async (req: Request, res: Response) => {
  // Clear cookies
  clearCookie(res, "accessToken");
  clearCookie(res, "refreshToken");

  res.status(200).json({
    success: true,
    message: "Logout successful",
    data: null,
  });
};

export const AuthController = {
  login,
  logout,
};
