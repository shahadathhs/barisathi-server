import mongoose, { Schema } from 'mongoose'

import { BookingStatus, IBooking } from './booking.interface'

const bookingSchema = new Schema<IBooking>(
  {
    listing: { type: Schema.Types.ObjectId, ref: 'Listing', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: BookingStatus, default: BookingStatus.PENDING },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true }
  },
  { timestamps: true }
)

export default mongoose.model<IBooking>('Booking', bookingSchema)
