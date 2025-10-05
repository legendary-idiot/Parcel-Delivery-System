import { CookieOptions, Response } from "express";

export const setCookie = (
  res: Response,
  tokenType: string,
  tokenValue: string,
  options: CookieOptions
) => {
  const {
    httpOnly = true,
    secure = process.env.NODE_ENV === "production",
    sameSite = "lax",
    maxAge = 86400 * 1000,
  } = options;

  res.cookie(tokenType, tokenValue, {
    httpOnly,
    secure,
    sameSite,
    maxAge,
  });
};

export const clearCookie = (res: Response, tokenType: string) => {
  res.clearCookie(tokenType, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
};
