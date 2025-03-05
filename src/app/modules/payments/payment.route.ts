import { Router } from 'express'

import Authentication from '../../middlewares/authentication'
import validateRequest from '../../middlewares/validateRequest'
import { UserRole } from '../auth/auth.user.interface'

import { PaymentController } from './payment.controller'
import { PaymentValidation } from './payment.validation'

const router = Router()

// * Create checkout session (Accessible to TENANT)
router.post(
  '/create-checkout-session',
  Authentication(UserRole.TENANT),
  validateRequest(PaymentValidation.createCheckoutSessionSchema),
  PaymentController.createCheckoutSession
)

// * Get transaction records (Accessible to TENANT and LANDLORD)
router.get(
  '/transactions',
  Authentication(UserRole.TENANT, UserRole.LANDLORD),
  PaymentController.getTransactions
)

export const PaymentRoutes = router
