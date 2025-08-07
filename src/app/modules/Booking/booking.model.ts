import mongoose, { Schema } from "mongoose";
import {
  IBooking,
  ParcelStatus,
  ParcelType,
  TrackingEvent,
} from "./booking.interface";

const trackingSchema = new Schema<TrackingEvent>(
  {
    status: {
      type: String,
      enum: Object.values(ParcelStatus),
      default: ParcelStatus.Requested,
    },
    location: {
      type: String,
      required: [true, "Current location is required"],
    },

    note: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const bookingSchema = new Schema<IBooking>(
  {
    trackingId: {
      type: String,
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Sender Information is required"],
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Receiver Information is required"],
    },
    parcelType: {
      type: String,
      enum: Object.values(ParcelType),
      required: [true, "Parcel Type is required"],
      default: ParcelType.Document,
    },
    weight: {
      type: Number,
      required: [true, "Weight is required"],
    },
    fee: {
      type: Number,
      required: [true, "Weight is required"],
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    trackingEvents: [trackingSchema],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Booking = mongoose.model<IBooking>("Booking", bookingSchema);
