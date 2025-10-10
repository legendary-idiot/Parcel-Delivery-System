import express from "express";
import { BookingController } from "./booking.controller";
import { inputDataValidation } from "../../middlewares/inputDataValidation";
import {
  createBookingValidation,
  updateBookingValidation,
  addTrackingEventValidation,
  getBookingValidation,
  getBookingsByUserValidation,
} from "./booking.validation";
import checkAuth from "../../middlewares/checkAuth";
import { Role } from "../User/user.interface";

const router = express.Router();

// Create a new booking
router.post(
  "/create-booking",
  checkAuth(...Object.values(Role)),
  inputDataValidation(createBookingValidation),
  BookingController.createBooking
);

// Add tracking event to booking
router.post(
  "/:bookingId/tracking",
  checkAuth(Role.Admin, Role.SuperAdmin),
  inputDataValidation(addTrackingEventValidation),
  BookingController.addTrackingEvent
);

// Update booking details
router.patch(
  "/update/:bookingId",
  checkAuth(...Object.values(Role)),
  inputDataValidation(updateBookingValidation),
  BookingController.updateBooking
);

// Delete booking
router.delete("/:bookingId", BookingController.deleteBooking);

// Get booking statistics
router.get("/stats", BookingController.getBookingStats);

// Get all bookings with pagination
router.get(
  "/all-bookings",
  checkAuth(Role.Admin, Role.SuperAdmin),
  BookingController.getAllBookings
);

// Get booking by tracking ID
router.get(
  "/tracking/:trackingId",
  inputDataValidation(getBookingValidation),
  BookingController.getBookingByTrackingId
);

// Get bookings by user
router.get(
  "/user/:userId",
  inputDataValidation(getBookingsByUserValidation),
  BookingController.getBookingsByUser
);

export const BookingRoutes = router;
