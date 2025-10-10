import { IBooking, ParcelStatus, TrackingEvent } from "./booking.interface";
import { Booking } from "./booking.model";
import { User } from "../User/user.model";
import AppError from "../../errorHelpers/customError";
import mongoose, { Types } from "mongoose";
import { generateTrackingID } from "../../utils/generateTrackingID";
import { ActiveStatus, Role } from "../User/user.interface";
import { JwtPayload } from "jsonwebtoken";

// Create New Booking
export const createBooking = async (
  bookingData: Partial<IBooking>,
  tokenPayload: JwtPayload
) => {
  // Check if sender exists
  const sender = await User.findById(bookingData.sender);
  if (!sender) {
    throw new AppError(404, "Sender not found");
  }

  // Ensure sender is the logged-in user if role is User
  if (tokenPayload.role === Role.User) {
    if (bookingData.sender?.toString() !== tokenPayload.userId) {
      throw new AppError(403, "Users can only create bookings for themselves");
    }
  }

  // Check if receiver exists
  const receiver = await User.findById(bookingData.receiver);
  if (!receiver) {
    throw new AppError(404, "Receiver not found");
  }

  // Ensure sender and receiver are not the same
  if (bookingData.sender?.toString() === bookingData.receiver?.toString()) {
    throw new AppError(400, "Sender and receiver cannot be the same user");
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

  // Populate sender details and receiver details
  const populatedBooking = await Booking.findById(newBooking._id)
    .populate("sender", "firstName lastName email phone address")
    .populate("receiver", "firstName lastName email phone address");

  return {
    booking: populatedBooking,
  };
};

//Update Booking
export const updateBooking = async (
  bookingId: string,
  updatedData: Partial<IBooking>,
  tokenPayload: JwtPayload
) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new AppError(404, "Booking not found");
  }

  // Check if booking is cancelled
  if (booking.isCancelled) {
    throw new AppError(400, "Cannot update a cancelled booking");
  }

  // Role-based authorization
  if (
    tokenPayload.role === Role.User &&
    booking.sender.toString() !== tokenPayload.userId
  ) {
    throw new AppError(403, "Only senders can update their own bookings");
  }

  // Last event status check
  const lastEvent = booking.trackingEvents[booking.trackingEvents.length - 1];
  if (
    lastEvent &&
    [
      ParcelStatus.Confirmed,
      ParcelStatus.Dispatched,
      ParcelStatus.InTransit,
      ParcelStatus.OutForDelivery,
      ParcelStatus.Delivered,
    ].includes(lastEvent.status)
  ) {
    throw new AppError(400, "Booking cannot be updated at this stage");
  }

  // Validate receiver
  if (updatedData.receiver) {
    const receiver = await User.findById(updatedData.receiver);
    if (!receiver || receiver.isActive !== ActiveStatus.Active) {
      throw new AppError(404, "New receiver not found or inactive");
    }
  }

  const session = await mongoose.startSession();
  if (!session) {
    throw new AppError(500, "Failed to start MongoDB session");
  }

  try {
    session.startTransaction();
    if (
      updatedData.receiver &&
      booking.receiver.toString() !== updatedData.receiver.toString()
    ) {
      await User.updateOne(
        { _id: booking.receiver },
        { $pull: { bookings: booking._id } },
        { session }
      );
      await User.updateOne(
        { _id: updatedData.receiver },
        { $addToSet: { bookings: booking._id } },
        { session }
      );
    }

    // Apply updates
    booking.set(updatedData);
    await booking.save({ session });

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw new AppError(500, "Failed to update booking");
  } finally {
    await session.endSession();
  }

  // Populate and return updated booking
  const populatedBooking = await Booking.findById(booking._id)
    .populate("sender", "firstName lastName phone address")
    .populate("receiver", "firstName lastName phone address");

  return { booking: populatedBooking };
};

export const addTrackingEvent = async (
  bookingId: string,
  trackingEvent: TrackingEvent
) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new AppError(404, "Booking not found");
  }

  // Check if booking is cancelled or blocked
  if (booking.isCancelled || booking.isBlocked) {
    throw new AppError(
      400,
      "Cannot add tracking events to a cancelled or blocked booking"
    );
  }

  // Check if booking is already delivered
  const lastEvent = booking.trackingEvents[booking.trackingEvents.length - 1];
  if (lastEvent?.status === ParcelStatus.Delivered) {
    throw new AppError(
      400,
      "Cannot add tracking events to a delivered booking"
    );
  }

  // Add new tracking event
  booking.trackingEvents.push(trackingEvent);
  await booking.save();

  const updatedBooking = await Booking.findById(bookingId)
    .populate("sender", "firstName lastName phone address")
    .populate("receiver", "firstName lastName phone address");

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
  role: Role.User,
  page: number = 1,
  limit: number = 10
) => {
  const skip = (page - 1) * limit;
  const query = { [role === Role.User ? "sender" : "receiver"]: userId };

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
