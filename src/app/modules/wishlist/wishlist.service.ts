import AppError from 'app/errors/functions/AppError'
import { httpStatusCode } from 'app/utils/enum/statusCode'
import mongoose from 'mongoose'

import { IWishlist } from './wishlist.interface'
import Wishlist from './wishlist.model'

// * Create or update wishlist
const createOrUpdateWishlist = async (
  userId: string,
  bikeId: string,
  action: 'add' | 'remove'
): Promise<IWishlist> => {
  const bikeObjectId = new mongoose.Types.ObjectId(bikeId)
  let wishlist = await Wishlist.findOne({ tenant: userId })

  if (!wishlist) {
    if (action === 'remove') {
      throw new AppError(httpStatusCode.BAD_REQUEST, 'No wishlist to remove bike from')
    }

    wishlist = await Wishlist.create({
      tenant: userId,
      bikes: [bikeObjectId]
    })

    return (await Wishlist.findById(wishlist._id).populate('bikes')) as IWishlist
  }

  const bikeExists = wishlist.bikes.some(existingBikeId => existingBikeId.toString() === bikeId)

  if (action === 'add' && !bikeExists) {
    wishlist.bikes.push(bikeObjectId)
    await wishlist.save()
  }

  if (action === 'remove' && bikeExists) {
    wishlist.bikes = wishlist.bikes.filter(existingBikeId => existingBikeId.toString() !== bikeId)
    await wishlist.save()
  }

  const updatedWishlist = await Wishlist.findById(wishlist._id).populate('bikes')
  if (!updatedWishlist) {
    throw new AppError(httpStatusCode.NOT_FOUND, 'Wishlist not found')
  }

  return updatedWishlist
}

// * Get wishlist for tenant
const getWishlistForTenant = async (userId: string): Promise<IWishlist> => {
  const wishlist = await Wishlist.findOne({ tenant: userId }).populate('bikes')
  if (!wishlist) {
    throw new AppError(httpStatusCode.NOT_FOUND, 'Listing not found')
  }

  // * Return the wishlist
  return wishlist
}

export const WishlistService = {
  createOrUpdateWishlist,
  getWishlistForTenant
}
