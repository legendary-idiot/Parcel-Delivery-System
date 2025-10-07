import { IBooking, ParcelStatus, TrackingEvent } from "./booking.interface";
import { Booking } from "./booking.model";
import { User } from "../User/user.model";
import AppError from "../../errorHelpers/customError";
import { Types } from "mongoose";
import { generateTrackingID } from "../../utils/generateTrackingID";
import { Role } from "../User/user.interface";

// Generate unique tracking ID

export const createBooking = async (bookingData: Partial<IBooking>) => {
  // Check if sender exists
  const sender = await User.findById(bookingData.sender);
  if (!sender) {
    throw new AppError(404, "Sender not found");
  }

  // Generate tracking ID
  const trackingId = generateTrackingID();

  // Create initial tracking event
  const initialTrackingEvent: TrackingEvent = {
    status: ParcelStatus.Requested,
    location: bookingData.trackingEvents?.[0]?.location || "Origin",
    note: bookingData.trackingEvents?.[0]?.note || "Parcel booking created",
  };

  // Create booking
  const newBooking = await Booking.create({
    ...bookingData,
    trackingId,
    trackingEvents: [initialTrackingEvent],
  });

  // Populate sender details
  const populatedBooking = await Booking.findById(newBooking._id).populate(
    "sender",
    "firstName lastName email phone address"
  );

  return {
    booking: populatedBooking,
  };
};

export const getAllBookings = async (page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;

  const bookings = await Booking.find()
    .populate("sender", "firstName lastName email phone address")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Booking.countDocuments();

  return {
    bookings,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

export const getBookingByTrackingId = async (trackingId: string) => {
  const booking = await Booking.findOne({ trackingId }).populate(
    "sender",
    "firstName lastName email phone address"
  );

  if (!booking) {
    throw new AppError(404, "Booking not found");
  }

  return {
    booking,
  };
};

export const getBookingsByUser = async (
  userId: string,
  role: Role.Sender,
  page: number = 1,
  limit: number = 10
) => {
  const skip = (page - 1) * limit;
  const query =
    role === Role.Sender ? { sender: userId } : { receiver: userId };

  const bookings = await Booking.find(query)
    .populate("sender", "firstName lastName email phone address")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Booking.countDocuments(query);

  return {
    bookings,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

export const updateBooking = async (
  bookingId: string,
  updateData: Partial<IBooking>
) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new AppError(404, "Booking not found");
  }

  // Check if booking is already delivered
  const lastEvent = booking.trackingEvents[booking.trackingEvents.length - 1];
  if (lastEvent?.status === ParcelStatus.Delivered) {
    throw new AppError(400, "Cannot update delivered booking");
  }

  const updatedBooking = await Booking.findByIdAndUpdate(
    bookingId,
    updateData,
    { new: true, runValidators: true }
  ).populate("sender", "firstName lastName email phone address");

  return {
    booking: updatedBooking,
  };
};

export const addTrackingEvent = async (
  bookingId: string,
  trackingEvent: TrackingEvent
) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new AppError(404, "Booking not found");
  }

  // Check if booking is already delivered
  const lastEvent = booking.trackingEvents[booking.trackingEvents.length - 1];
  if (lastEvent?.status === ParcelStatus.Delivered) {
    throw new AppError(400, "Cannot add tracking events to delivered booking");
  }

  // Add new tracking event
  booking.trackingEvents.push(trackingEvent);
  await booking.save();

  const updatedBooking = await Booking.findById(bookingId)
    .populate("sender", "firstName lastName email phone address")
    .populate("receiver", "firstName lastName email phone address");

  return {
    booking: updatedBooking,
  };
};

export const deleteBooking = async (bookingId: string) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new AppError(404, "Booking not found");
  }

  // Check if booking is already dispatched
  const lastEvent = booking.trackingEvents[booking.trackingEvents.length - 1];
  if (lastEvent?.status !== ParcelStatus.Requested) {
    throw new AppError(400, "Cannot delete booking that has been processed");
  }

  await Booking.findByIdAndDelete(bookingId);

  return {
    message: "Booking deleted successfully",
  };
};

export const getBookingStats = async () => {
  const stats = await Booking.aggregate([
    {
      $group: {
        _id: "$parcelType",
        count: { $sum: 1 },
        totalWeight: { $sum: "$weight" },
        totalFee: { $sum: "$fee" },
      },
    },
  ]);

  const statusStats = await Booking.aggregate([
    {
      $unwind: "$trackingEvents",
    },
    {
      $group: {
        _id: "$trackingEvents.status",
        count: { $sum: 1 },
      },
    },
  ]);

  const totalBookings = await Booking.countDocuments();
  const totalRevenue = await Booking.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: "$fee" },
      },
    },
  ]);

  return {
    totalBookings,
    totalRevenue: totalRevenue[0]?.total || 0,
    parcelTypeStats: stats,
    statusStats,
  };
};

export const BookingService = {
  createBooking,
  getAllBookings,
  getBookingByTrackingId,
  getBookingsByUser,
  updateBooking,
  addTrackingEvent,
  deleteBooking,
  getBookingStats,
};
