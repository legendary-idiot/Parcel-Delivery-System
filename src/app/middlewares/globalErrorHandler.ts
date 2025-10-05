import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import AppError from "../errorHelpers/customError";
import mongoose from "mongoose";

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
  }
  // ZodError Validation
  else if (error instanceof ZodError) {
    statusCode = 400;
    message = "Validation Error";
    errorDetails =
      error.issues?.map((err: any) => ({
        field: err.path?.join(".") || "unknown",
        message: err.message || "Validation failed",
      })) || [];
  }
  // Mongoose ValidationError
  else if (error instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = "Mongoose Validation Error";
    errorDetails = Object.values(error.errors).map((err: any) => ({
      field: err.path,
      message: err.message,
    }));
  }
  // Mongoose CastError
  else if (error instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid ${error.path}: ${error.value}`;
    errorDetails = [{ field: error.path, message: "Invalid value or format." }];
  }
  // MongoDB Duplicate Key Error
  else if (error.code === 11000) {
    statusCode = 409;
    message = "Duplicate Key Error";
    errorDetails = Object.keys(error.keyValue).map((field) => ({
      field,
      message: `Duplicate value: "${error.keyValue[field]}" already exists.`,
    }));
  }
  // Generic JS Error
  else if (error instanceof Error) {
    statusCode = 500;
    message = error.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorDetails,
  });
};
