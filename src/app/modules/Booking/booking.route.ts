import express from "express";
import { BookingController } from "./booking.controller";
import { userDataValidation } from "../../middlewares/userDataValidation";
import {
  createBookingValidation,
  updateBookingValidation,
  addTrackingEventValidation,
  getBookingValidation,
  getBookingsByUserValidation,
} from "./booking.validation";

const router = express.Router();

// Create a new booking
router.post(
  "/create-booking",
  userDataValidation(createBookingValidation),
  BookingController.createBooking
);

// Get all bookings with pagination
router.get("/", BookingController.getAllBookings);

// Get booking by tracking ID
router.get(
  "/tracking/:trackingId",
  userDataValidation(getBookingValidation),
  BookingController.getBookingByTrackingId
);

// Get bookings by user (sender or receiver)
router.get(
  "/user/:userId",
  userDataValidation(getBookingsByUserValidation),
  BookingController.getBookingsByUser
);

// Update booking details
router.patch(
  "/:bookingId",
  userDataValidation(updateBookingValidation),
  BookingController.updateBooking
);

// Add tracking event to booking
router.post(
  "/:bookingId/tracking",
  userDataValidation(addTrackingEventValidation),
  BookingController.addTrackingEvent
);

// Delete booking
router.delete("/:bookingId", BookingController.deleteBooking);

// Get booking statistics
router.get("/stats", BookingController.getBookingStats);

export const BookingRoutes = router;
