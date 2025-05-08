import mongoose, { Schema, Model } from 'mongoose'

import { IWishlist } from './wishlist.interface'

const WishlistSchema: Schema<IWishlist> = new mongoose.Schema(
  {
    listings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
        required: [true, 'Bike reference is required']
      }
    ],
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Tenant reference is required']
    }
  },
  {
    timestamps: true // * Automatically adds createdAt and updatedAt
  }
)

const Wishlist: Model<IWishlist> = mongoose.model<IWishlist>('Wishlist', WishlistSchema)
export default Wishlist
