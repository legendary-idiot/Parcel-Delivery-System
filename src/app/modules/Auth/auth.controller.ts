import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { setCookie, clearCookie } from "../../utils/setCookie";
import { asyncWrapper } from "../../utils/asyncWrapper";

const login = asyncWrapper(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await AuthService.loginUser(email, password);

  // Set cookies for tokens
  setCookie(res, "accessToken", result.accessToken, {
    maxAge: 12 * 60 * 60 * 1000, // 12 hours
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  setCookie(res, "refreshToken", result.refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      user: result.user,
    },
  });
});

const logout = asyncWrapper(async (req: Request, res: Response) => {
  // Clear cookies
  clearCookie(res, "accessToken");
  clearCookie(res, "refreshToken");

  res.status(200).json({
    success: true,
    message: "Logout successful",
    data: null,
  });
});

export const AuthController = {
  login,
  logout,
};
