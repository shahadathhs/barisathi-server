import { Router } from 'express'

import Authentication from '../../middlewares/authentication'
import validateRequest from '../../middlewares/validateRequest'
import { UserRole } from '../auth/auth.user.interface'

import { ListingController } from './listing.controller'
import { ListingValidation } from './listing.validation'

const router = Router()

// * Create listing (Landlord only)
router.post(
  '/',
  Authentication(UserRole.LANDLORD),
  validateRequest(ListingValidation.createListingSchema),
  ListingController.createListing
)

// * Get all listings (Public)
router.get('/', ListingController.getAllListings)

// * Get all listings for a landlord (Landlord only)
router.get(
  '/landlord',
  Authentication(UserRole.LANDLORD),
  ListingController.getAllListingsForLandlord
)

// * Get listing details (Public)
router.get('/:id', ListingController.getListingById)

// * Update listing (Landlord only)
router.patch(
  '/:id',
  Authentication(UserRole.LANDLORD),
  validateRequest(ListingValidation.updateListingSchema),
  ListingController.updateListing
)

// * Delete listing (Landlord only)
router.delete('/:id', Authentication(UserRole.LANDLORD), ListingController.deleteListing)

export const ListingRoutes = router
