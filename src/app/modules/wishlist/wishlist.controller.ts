import { asyncHandler } from 'app/utils/asyncHandler'
import { httpStatusCode } from 'app/utils/enum/statusCode'
import sendResponse from 'app/utils/sendResponse'
import { NextFunction, Request, Response } from 'express'

import { WishlistService } from './wishlist.service'

const createOrUpdateWishlist = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user.userId
  const listingId = req.body.listingId
  const action = req.body.action

  const result = await WishlistService.createOrUpdateWishlist(userId, listingId, action)
  sendResponse(res, {
    statusCode: httpStatusCode.CREATED,
    success: true,
    message: 'Wishlist created or updated successfully.',
    data: result
  })
  next()
}

const getWishlistForTenant = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user.userId
  const result = await WishlistService.getWishlistForTenant(userId)
  sendResponse(res, {
    statusCode: httpStatusCode.CREATED,
    success: true,
    message: 'Wishlist retrieved successfully.',
    data: result
  })
  next()
}

export const WishlistController = {
  createOrUpdateWishlist: asyncHandler(createOrUpdateWishlist),
  getWishlistForTenant: asyncHandler(getWishlistForTenant)
}
