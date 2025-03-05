import mongoose, { Document } from 'mongoose'

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled'
}

export type TBookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus]

export interface IBooking extends Document {
  listing: mongoose.Types.ObjectId
  user: mongoose.Types.ObjectId
  status: TBookingStatus
  checkInDate: Date
  checkOutDate: Date
}
