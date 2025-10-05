import { Types } from "mongoose";

export enum Role {
  SuperAdmin = "SuperAdmin",
  Admin = "Admin",
  Sender = "Sender",
  Receiver = "Receiver",
}

export enum ActiveStatus {
  Active = "Active",
  Inactive = "Inactive",
  Blocked = "Blocked",
  Deleted = "Deleted",
}

export interface IUser {
  _id?: Types.ObjectId;
  firstName: string;
  lastName: string;
  role: Role;
  isActive: ActiveStatus;
  email: string;
  password: string;
  phone?: string;
  address: string;
  bookings: Types.ObjectId[];
}
