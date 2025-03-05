import mongoose, { Schema, Model } from 'mongoose'

import { IPayment } from './payment.interface'

const PaymentSchema: Schema<IPayment> = new Schema(
  {
    stripeSessionId: { type: String, required: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    landlord: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: { type: String, required: true }
  },
  { timestamps: true }
)

const Payment: Model<IPayment> = mongoose.model<IPayment>('Payment', PaymentSchema)
export default Payment
