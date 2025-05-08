import mongoose, { Document } from 'mongoose'

// * Interface for Wishlist
export interface IWishlist extends Document {
  tenant: mongoose.Types.ObjectId
  bikes: mongoose.Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}
