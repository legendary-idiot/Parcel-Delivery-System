import { JwtPayload } from "jsonwebtoken";
import { ActiveStatus, IUser } from "../modules/User/user.interface";
import { User } from "../modules/User/user.model";
import { generateToken, verifyToken } from "./jwt";
import AppError from "../errorHelpers/customError";

export const createAccessToken = (userData: Partial<IUser>) => {
  const tokenPayload = {
    userId: userData._id,
    email: userData.email,
    role: userData.role,
  };

  const accessToken = generateToken(
    tokenPayload,
    process.env.JWT_ACCESS_SECRET!,
    process.env.JWT_ACCESS_EXPIRY!
  );
  const refreshToken = generateToken(
    tokenPayload,
    process.env.JWT_REFRESH_SECRET!,
    process.env.JWT_REFRESH_EXPIRY!
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const createAccessTokenFromRefreshToken = async (
  refreshToken: string
) => {
  const verifyRefreshToken = verifyToken(
    refreshToken,
    process.env.JWT_REFRESH_SECRET!
  );

  const userExist = await User.findOne({ email: verifyRefreshToken.email });
  if (!userExist) {
    throw new AppError(404, "No user found with this email");
  }
  if (
    userExist.isActive === ActiveStatus.Blocked ||
    userExist.isActive === ActiveStatus.Inactive ||
    userExist.isActive === ActiveStatus.Deleted
  ) {
    throw new AppError(403, `Sorry, your account is ${userExist.isActive}`);
  }

  const tokenPayload = {
    userId: userExist._id,
    email: userExist.email,
    role: userExist.role,
  };

  const newAccessToken = generateToken(
    tokenPayload,
    process.env.JWT_ACCESS_SECRET!,
    process.env.JWT_ACCESS_EXPIRY!
  );

  return newAccessToken;
};
