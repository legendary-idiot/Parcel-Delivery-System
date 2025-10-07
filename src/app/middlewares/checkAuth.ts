import { NextFunction, Request, Response, urlencoded } from "express";
import AppError from "../errorHelpers/customError";
import { verifyToken } from "../utils/jwt";
import { ActiveStatus, Role } from "../modules/User/user.interface";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/User/user.model";

// Middleware: checks Authorization header for Bearer token, verifies, attaches payload to req.user

interface authPayload {
  userId: string;
  email: string;
  role: Role;
}

export const checkAuth =
  (...allowedRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeaderAccessToken = req.headers.authorization;

      if (!authHeaderAccessToken) {
        throw new AppError(
          401,
          "Unauthorized: You are not authorized for this action"
        );
      }

      const verifiedToken = verifyToken(
        authHeaderAccessToken,
        process.env.JWT_ACCESS_SECRET!
      );

      const userExist = await User.findById(verifiedToken.userId);
      if (!userExist) {
        throw new AppError(401, "Unauthorized: user not found");
      }

      if (
        userExist.isActive === ActiveStatus.Inactive ||
        userExist.isActive === ActiveStatus.Blocked
      ) {
        throw new AppError(403, `Forbidden: user is ${userExist.isActive}`);
      }

      if (userExist.isActive === ActiveStatus.Deleted) {
        throw new AppError(401, "User is deleted");
      }

      if (allowedRoles.length && !allowedRoles.includes(verifiedToken.role)) {
        throw new AppError(
          403,
          "Forbidden: You don't have permission to access this resource"
        );
      }
      // Attach selected payload fields to request
      req.user = {
        userId: verifiedToken.userId,
        email: verifiedToken.email,
        role: verifiedToken.role,
      } as JwtPayload;

      return next();
    } catch (error: any) {
      if (error?.name === "TokenExpiredError") {
        return next(new AppError(401, "Unauthorized: token expired"));
      }
      if (error?.name === "JsonWebTokenError") {
        return next(new AppError(401, "Unauthorized: invalid token"));
      }
      return next(error);
    }
  };

export default checkAuth;
