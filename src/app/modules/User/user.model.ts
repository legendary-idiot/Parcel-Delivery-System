import mongoose, { Schema } from "mongoose";
import { ActiveStatus, IUser, Role } from "./user.interface";

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: [true, "First Name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last Name is required"],
      trim: true,
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.Sender,
    },
    isBlocked: {
      type: String,
      enum: Object.values(ActiveStatus),
      default: ActiveStatus.Active,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
      required: true,
    },
    bookings: [
      {
        type: Schema.Types.ObjectId,
        ref: "Booking",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const User = mongoose.model<IUser>("User", userSchema);
