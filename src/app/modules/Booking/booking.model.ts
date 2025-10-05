import mongoose, { Schema } from "mongoose";
import { calculateParcelFee } from "../../utils/calculateParcelFee";
import {
  IBooking,
  ParcelStatus,
  ParcelType,
  TrackingEvent,
} from "./booking.interface";

const receiverSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Receiver Name is required"],
    },
    phone: {
      type: String,
      required: [true, "Receiver Phone is required"],
    },
    address: {
      type: String,
      trim: true,
      required: [true, "Receiver Address is required"],
    },
  },
  { _id: false }
);

const trackingEventSchema = new Schema<TrackingEvent>(
  {
    status: {
      type: String,
      enum: Object.values(ParcelStatus),
      default: ParcelStatus.Requested,
    },
    location: {
      type: String,
      default: "Picked up from sender",
      required: [true, "Location is required"],
    },
    note: {
      type: String,
    },
  },
  { _id: false, timestamps: true }
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
    receiver: receiverSchema,
    parcelType: {
      type: String,
      enum: Object.values(ParcelType),
      required: [true, "Parcel Type is required"],
      default: ParcelType.Document,
    },
    weight: {
      type: Number,
      required: [true, "Weight is required"],
      min: [0.1, "Weight must be at least 0.1 kg"],
      max: [10, "Weight cannot exceed 10 kg"],
    },
    fee: {
      type: Number,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    trackingEvents: {
      type: [trackingEventSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Pre-save hook to calculate fee before saving
bookingSchema.pre("save", function (next) {
  if (this.isModified("parcelType") || this.isModified("weight")) {
    this.fee = calculateParcelFee(this.parcelType, this.weight);
  }
  next();
});

export const Booking = mongoose.model<IBooking>("Booking", bookingSchema);
