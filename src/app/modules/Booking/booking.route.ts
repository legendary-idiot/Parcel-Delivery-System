import express from "express";
import { BookingController } from "./booking.controller";
import { inputDataValidation } from "../../middlewares/inputDataValidation";
import {
  createBookingValidation,
  updateBookingValidation,
  addTrackingEventValidation,
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
router.delete(
  "/delete/:bookingId",
  checkAuth(Role.SuperAdmin),
  BookingController.deleteBooking
);

// Get all bookings with pagination
router.get(
  "/all-bookings",
  checkAuth(Role.Admin, Role.SuperAdmin),
  BookingController.getAllBookings
);

// Get booking by tracking ID (public access)
router.get("/tracking/:trackingId", BookingController.getBookingByTrackingId);

// Get bookings by user
router.get(
  "/user/:userId",
  checkAuth(...Object.values(Role)),
  BookingController.getBookingsByUser
);

// Get booking statistics (admin, super admin only)
router.get(
  "/stats",
  checkAuth(Role.Admin, Role.SuperAdmin),
  BookingController.getBookingStats
);

export const BookingRoutes = router;
