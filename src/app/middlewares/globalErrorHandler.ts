import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import AppError from "../errorHelpers/customError";

export const globalErrorHandlers = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = "Sorry, Something went wrong!";
  let errorDetails = null;

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error instanceof ZodError) {
    statusCode = 400;
    message = "Validation Error";

    // Extract validation errors from ZodError
    errorDetails =
      error.issues?.map((err: any) => ({
        field: err.path?.join(".") || "unknown",
        message: err.message || "Validation failed",
      })) || [];
  } else if (error instanceof Error) {
    statusCode = 500;
    message = error.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorDetails,
  });
};
