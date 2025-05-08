import Authentication from 'app/middlewares/authentication'
import validateRequest from 'app/middlewares/validateRequest'
import { UserRole } from 'app/utils/enum/userRole'
import { Router } from 'express'

import { WishlistController } from './wishlist.controller'
import { WishlistValidation } from './wishlist.validation'

const router = Router()

// * Create or update (add or remove a bike based on action) wishlist of a user (Tenant only)
router.patch(
  '/',
  Authentication(UserRole.TENANT),
  validateRequest(WishlistValidation.wishlistSchema),
  WishlistController.createOrUpdateWishlist
)

// * Get a wishlist for a user (Tenant only)
router.get('/tenant', Authentication(UserRole.TENANT), WishlistController.getWishlistForTenant)

export const WishlistRoutes = router
