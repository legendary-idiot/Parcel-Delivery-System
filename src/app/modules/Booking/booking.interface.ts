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

export interface Receiver {
  name: string;
  phone: string;
  address: string;
  email?: string;
}

export interface IBooking {
  trackingId: string;
  sender: Types.ObjectId;
  receiver: Receiver;
  parcelType: ParcelType;
  weight: number;
  fee: number;
  isBlocked?: boolean;
  trackingEvents: TrackingEvent[];
}
