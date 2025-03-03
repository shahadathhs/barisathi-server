import express from 'express'

import Authentication from '../../middlewares/authentication'
import { UserRole } from '../auth/auth.user.interface'

import { paymentController } from './payment.controller'

const router = express.Router()

router.post(
  '/create-checkout-session',
  Authentication(UserRole.TENANT),

  paymentController.createCheckoutSession
)

export const paymentRoutes = router
