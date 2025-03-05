import { NextFunction, Request, Response } from 'express'

import { httpStatusCode } from '../../enum/statusCode'
import { CustomJwtPayload } from '../../interface'
import { asyncHandler } from '../../utils/asyncHandler'
import sendResponse from '../../utils/sendResponse'
import { TRole } from '../auth/auth.user.interface'

import { PaymentService } from './payment.service'

// * Create checkout session (Tenant only)
const createCheckoutSession = async (req: Request, res: Response, next: NextFunction) => {
  // Expecting bookingId, amount, currency, email, clientURL, tenantId, landlordId in the request body
  const payload = req.body
  const sessionUrl = await PaymentService.createCheckoutSession(payload)
  sendResponse(res, {
    statusCode: httpStatusCode.CREATED,
    success: true,
    message: 'Checkout session created successfully',
    data: { url: sessionUrl }
  })
  next()
}

// * Retrieve transactions for the logged-in user (Tenant or Landlord)
const getTransactions = async (req: Request, res: Response, next: NextFunction) => {
  const user: CustomJwtPayload = req.user
  const payments = await PaymentService.getTransactionsForUser(user.userId, user.role as TRole)
  sendResponse(res, {
    statusCode: httpStatusCode.OK,
    success: true,
    message: 'Transactions retrieved successfully',
    data: payments
  })
  next()
}

export const PaymentController = {
  createCheckoutSession: asyncHandler(createCheckoutSession),
  getTransactions: asyncHandler(getTransactions)
}
