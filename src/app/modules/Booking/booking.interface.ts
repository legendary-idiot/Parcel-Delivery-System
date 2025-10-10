import { Types } from "mongoose";

export enum ParcelType {
  Document = "Document",
  Package = "Package",
  Fragile = "Fragile",
}

export enum ParcelStatus {
  Requested = "Requested",
  Confirmed = "Confirmed",
  Dispatched = "Dispatched",
  InTransit = "In Transit",
  OutForDelivery = "Out For Delivery",
  Delivered = "Delivered",
}

export interface TrackingEvent {
  status: ParcelStatus;
  location: string;
  note?: string;
}

export interface IBooking {
  _id?: Types.ObjectId;
  trackingId: string;
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  parcelType: ParcelType;
  weight: number;
  fee: number;
  isBlocked?: boolean;
  isCancelled?: boolean;
  trackingEvents: TrackingEvent[];
}
