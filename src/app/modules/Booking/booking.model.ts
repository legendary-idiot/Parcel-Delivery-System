import mongoose, { Schema } from "mongoose";
import { calculateParcelFee } from "../../utils/calculateParcelFee";
import {
  IBooking,
  ParcelStatus,
  ParcelType,
  TrackingEvent,
} from "./booking.interface";
import { User } from "../User/user.model";

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
    isCancelled: {
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

// Post-save hook to update the user's bookings array
bookingSchema.post("save", async function (doc, next) {
  if (!this.isNew) return next(); // Only run for new documents
  try {
    await Promise.all([
      User.updateOne({ _id: doc.sender }, { $addToSet: { bookings: doc._id } }),
      User.updateOne(
        { _id: doc.receiver },
        { $addToSet: { bookings: doc._id } }
      ),
    ]);
    next();
  } catch (error: any) {
    next(error);
  }
});

export const Booking = mongoose.model<IBooking>("Booking", bookingSchema);
