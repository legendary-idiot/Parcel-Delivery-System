import * as z from "zod";
import { ParcelType, ParcelStatus } from "./booking.interface";

export const createBookingValidation = z.object({
  sender: z
    .string({ error: "Sender ID is required" })
    .min(1, { error: "Sender ID cannot be empty" }),

  receiver: z
    .string({ error: "Receiver ID is required" })
    .min(1, { error: "Receiver ID cannot be empty" }),

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
  receiver: z
    .string({ error: "Receiver ID is required" })
    .min(1, { error: "Receiver ID cannot be empty" })
    .optional(),

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

  isCancelled: z.boolean().optional(),
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
