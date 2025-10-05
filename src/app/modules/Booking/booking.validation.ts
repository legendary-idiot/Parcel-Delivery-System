import * as z from "zod";
import { ParcelType, ParcelStatus } from "./booking.interface";
import { Role } from "../User/user.interface";

export const createBookingValidation = z.object({
  sender: z
    .string({ error: "Sender ID is required" })
    .min(1, { error: "Sender ID cannot be empty" }),

  receiver: z.object({
    name: z.string({ error: "Receiver Name is required" }),
    phone: z
      .string({ error: "Phone must be string" })
      .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        error:
          "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
      }),
    address: z
      .string({ error: "Address must be string" })
      .trim()
      .min(5, { error: "Address cannot be less than 5 characters" })
      .max(200, { error: "Address cannot exceed 200 characters." }),
  }),

  parcelType: z
    .enum(Object.values(ParcelType), {
      error: "Invalid parcel type",
    })
    .default(ParcelType.Document),

  weight: z
    .number({ error: "Weight must be a number" })
    .min(0.1, { error: "Weight must be at least 0.1 kg" })
    .max(10, { error: "Weight cannot exceed 10 kg" }),

  fee: z
    .number({ error: "Fee must be a number" })
    .min(0, { error: "Fee cannot be negative" })
    .optional(),

  trackingEvents: z
    .array(
      z.object({
        status: z
          .enum(Object.values(ParcelStatus))
          .default(ParcelStatus.Requested),
        location: z
          .string({ error: "Location is required" })
          .min(1, { error: "Location cannot be empty" })
          .max(100, { error: "Location cannot exceed 100 characters" }),
        note: z
          .string()
          .max(200, { error: "Note cannot exceed 200 characters" })
          .optional(),
      })
    )
    .optional()
    .default([]),
});

export const updateBookingValidation = z.object({
  parcelType: z
    .enum(Object.values(ParcelType), {
      error: "Invalid parcel type",
    })
    .optional(),

  weight: z
    .number({ error: "Weight must be a number" })
    .min(0.1, { error: "Weight must be at least 0.1 kg" })
    .max(10, { error: "Weight cannot exceed 10 kg" })
    .optional(),

  fee: z
    .number({ error: "Fee must be a number" })
    .min(0, { error: "Fee cannot be negative" })
    .optional(),

  isBlocked: z.boolean().optional(),
});

export const addTrackingEventValidation = z.object({
  status: z.enum(Object.values(ParcelStatus), {
    error: "Invalid parcel status",
  }),

  location: z
    .string({ error: "Location is required" })
    .min(1, { error: "Location cannot be empty" })
    .max(100, { error: "Location cannot exceed 100 characters" }),

  note: z
    .string()
    .max(200, { error: "Note cannot exceed 200 characters" })
    .optional(),
});

export const getBookingValidation = z.object({
  trackingId: z
    .string({ error: "Tracking ID is required" })
    .min(1, { error: "Tracking ID cannot be empty" }),
});

export const getBookingsByUserValidation = z.object({
  userId: z
    .string({ error: "User ID is required" })
    .min(1, { error: "User ID cannot be empty" }),

  role: z
    .enum(Object.values(Role), {
      error: "Invalid role",
    })
    .default(Role.Sender)
    .optional(),
});
