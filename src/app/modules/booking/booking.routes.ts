import { Router } from 'express'

import Authentication from '../../middlewares/authentication'
import validateRequest from '../../middlewares/validateRequest'
import { UserRole } from '../auth/auth.user.interface'

import { BookingController } from './booking.controller'
import { BookingValidation } from './booking.validation'

const router = Router()

// * Create booking (Tenant only)
router.post(
  '/',
  Authentication(UserRole.TENANT),
  validateRequest(BookingValidation.createBookingSchema),
  BookingController.createBooking
)

// * Get all bookings (Admin only)
router.get(
  '/',
  Authentication(UserRole.ADMIN),
  BookingController.getAllBookings
)

// * Get booking details (Accessible by Admin and booking owner)
router.get(
  '/:id',
  Authentication(UserRole.ADMIN, UserRole.TENANT),
  BookingController.getBookingById
)

// * Update booking status (Admin only)
router.patch(
  '/:id/status',
  Authentication(UserRole.ADMIN),
  validateRequest(BookingValidation.updateBookingSchema),
  BookingController.updateBookingStatus
)

// * Delete booking (Admin only)
router.delete(
  '/:id',
  Authentication(UserRole.ADMIN),
  BookingController.deleteBooking
)

export const BookingRoutes = router
