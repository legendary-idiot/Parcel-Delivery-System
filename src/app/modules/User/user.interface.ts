import { Types } from "mongoose";

export enum Role {
  Admin = "Admin",
  Sender = "Sender",
  Receiver = "Receiver",
}

export enum ActiveStatus {
  Active = "Active",
  Inactive = "Inactive",
  Blocked = "Blocked",
}

export interface IUser {
  _id?: Types.ObjectId;
  firstName: string;
  lastName: string;
  role: Role;
  isBlocked: ActiveStatus;
  email: string;
  password: string;
  phone?: string;
  address: string;
  bookings: Types.ObjectId[];
}
