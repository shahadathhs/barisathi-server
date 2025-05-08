import AppError from 'app/errors/functions/AppError'
import { httpStatusCode } from 'app/utils/enum/statusCode'
import mongoose from 'mongoose'

import { IWishlist } from './wishlist.interface'
import Wishlist from './wishlist.model'

// * Create or update wishlist
const createOrUpdateWishlist = async (
  userId: string,
  listingId: string,
  action: 'add' | 'remove'
): Promise<IWishlist> => {
  const bikeObjectId = new mongoose.Types.ObjectId(listingId)
  let wishlist = await Wishlist.findOne({ tenant: userId })

  if (!wishlist) {
    if (action === 'remove') {
      throw new AppError(httpStatusCode.BAD_REQUEST, 'No wishlist to remove bike from')
    }

    wishlist = await Wishlist.create({
      tenant: userId,
      listings: [bikeObjectId]
    })

    return (await Wishlist.findById(wishlist._id).populate('listings')) as IWishlist
  }

  const listingExists = wishlist.listings.some(
    existingListingId => existingListingId.toString() === listingId
  )

  if (action === 'add' && !listingExists) {
    wishlist.listings.push(bikeObjectId)
    await wishlist.save()
  }

  if (action === 'remove' && listingExists) {
    wishlist.listings = wishlist.listings.filter(
      existingListingId => existingListingId.toString() !== listingId
    )
    await wishlist.save()
  }

  const updatedWishlist = await Wishlist.findById(wishlist._id).populate('listings')
  if (!updatedWishlist) {
    throw new AppError(httpStatusCode.NOT_FOUND, 'Wishlist not found')
  }

  return updatedWishlist
}

// * Get wishlist for tenant
const getWishlistForTenant = async (userId: string): Promise<IWishlist> => {
  const wishlist = await Wishlist.findOne({ tenant: userId }).populate('listings')
  if (!wishlist) {
    throw new AppError(httpStatusCode.NOT_FOUND, 'Wishlist not found for this user')
  }

  // * Return the wishlist
  return wishlist
}

export const WishlistService = {
  createOrUpdateWishlist,
  getWishlistForTenant
}
