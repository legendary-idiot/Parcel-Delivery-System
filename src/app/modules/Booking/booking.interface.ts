import { Types } from "mongoose";

export enum ParcelType {
  Document = "Document",
  Package = "Package",
  Fragile = "Fragile",
}

export enum ParcelStatus {
  Requested = "Requested",
  Approved = "Approved",
  Dispatched = "Dispatched",
  InTransit = "InTransit",
  Delivered = "Delivered",
}

export interface TrackingEvent {
  status: ParcelStatus;
  location: string;
  note?: string;
}

export interface IBooking {
  trackingId: string;
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  parcelType: ParcelType;
  weight: number;
  fee: number;
  isBlocked?: boolean;
  trackingEvents: TrackingEvent[];
}
