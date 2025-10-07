import { Request, Response } from "express";
import { BookingService } from "./booking.service";
import { Role } from "../User/user.interface";

const createBooking = async (req: Request, res: Response) => {
  const bookingData = req.body;
  const result = await BookingService.createBooking(bookingData);

  res.status(201).json({
    success: true,
    message: "Booking created successfully",
    data: result,
  });
};

const getAllBookings = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const result = await BookingService.getAllBookings(page, limit);

  res.status(200).json({
    success: true,
    message: "Bookings retrieved successfully",
    data: result,
  });
};

const getBookingByTrackingId = async (req: Request, res: Response) => {
  const { trackingId } = req.params;
  const result = await BookingService.getBookingByTrackingId(trackingId);

  res.status(200).json({
    success: true,
    message: "Booking retrieved successfully",
    data: result,
  });
};

const getBookingsByUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const role = req.query.role as Role.Sender;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const result = await BookingService.getBookingsByUser(
    userId,
    role,
    page,
    limit
  );

  res.status(200).json({
    success: true,
    message: "User bookings retrieved successfully",
    data: result,
  });
};

const updateBooking = async (req: Request, res: Response) => {
  const { bookingId } = req.params;
  const updateData = req.body;

  const result = await BookingService.updateBooking(bookingId, updateData);

  res.status(200).json({
    success: true,
    message: "Booking updated successfully",
    data: result,
  });
};

const addTrackingEvent = async (req: Request, res: Response) => {
  const { bookingId } = req.params;
  const trackingEvent = req.body;

  const result = await BookingService.addTrackingEvent(
    bookingId,
    trackingEvent
  );

  res.status(200).json({
    success: true,
    message: "Tracking event added successfully",
    data: result,
  });
};

const deleteBooking = async (req: Request, res: Response) => {
  const { bookingId } = req.params;

  const result = await BookingService.deleteBooking(bookingId);

  res.status(200).json({
    success: true,
    message: "Booking deleted successfully",
    data: result,
  });
};

const getBookingStats = async (req: Request, res: Response) => {
  const result = await BookingService.getBookingStats();

  res.status(200).json({
    success: true,
    message: "Booking statistics retrieved successfully",
    data: result,
  });
};

export const BookingController = {
  createBooking,
  getAllBookings,
  getBookingByTrackingId,
  getBookingsByUser,
  updateBooking,
  addTrackingEvent,
  deleteBooking,
  getBookingStats,
};
