import mongoose, { Document } from 'mongoose'

export interface IPayment extends Document {
  stripeSessionId: string
  booking: mongoose.Types.ObjectId
  tenant: mongoose.Types.ObjectId // Tenant (who is paying)
  landlord: mongoose.Types.ObjectId // Landlord (owner of booking asset)
  amount: number
  currency: string
  status: string
  createdAt: Date
  updatedAt: Date
}
