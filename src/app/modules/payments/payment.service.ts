import { configuration } from '../../config/config'
import { httpStatusCode } from '../../enum/statusCode'
import AppError from '../../errors/functions/AppError'
import { TRole, UserRole } from '../auth/auth.user.interface'

import { stripe } from './payment.config'
import { IPayment } from './payment.interface'
import Payment from './payment.model'

interface CreateCheckoutSessionPayload {
  bookingId: string // ID of the related booking
  amount: number // Amount in dollars
  currency: string // e.g., 'usd'
  email: string // Tenant's email
  tenantId: string // Tenant's ID (who is paying)
  landlordId: string // Landlord's ID (owner of the booking)
}

const createCheckoutSession = async (payload: CreateCheckoutSessionPayload): Promise<string> => {
  const { bookingId, amount, currency, email, tenantId, landlordId } = payload

  // Generate a random string for query parameters (for demo purposes)
  const randomString = Math.random().toString(36).substring(2, 15)

  const clientURL = configuration.client.url as string

  // Create a product name based on the booking
  const productName = `Booking Payment for ${bookingId}`

  // * Create the Stripe checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: currency,
          product_data: { name: productName },
          unit_amount: Math.round(amount * 100) // Convert dollars to cents
        },
        quantity: 1
      }
    ],
    metadata: { bookingId, email },
    mode: 'payment',
    success_url: `${clientURL}/checkout/success?${randomString}session_id={CHECKOUT_SESSION_ID}${randomString}&bookingId=${bookingId}`,
    cancel_url: `${clientURL}/checkout/cancel?bookingId=${bookingId}`
  })

  if (!session || !session.id || !session.url) {
    throw new AppError(httpStatusCode.INTERNAL_SERVER_ERROR, 'Failed to create checkout session')
  }

  // * Save the payment record in the database for transaction tracking
  await Payment.create({
    stripeSessionId: session.id,
    booking: bookingId,
    tenant: tenantId,
    landlord: landlordId,
    amount: amount,
    currency: currency,
    status: session.payment_status || 'pending'
  })

  return session.url
}

// * Retrieve transaction records for a user (tenant or landlord)
const getTransactionsForUser = async (userId: string, role: TRole): Promise<IPayment[]> => {
  const filter: { tenant?: string; landlord?: string } = {}
  if (role === UserRole.TENANT) {
    filter.tenant = userId
  } else if (role === UserRole.LANDLORD) {
    filter.landlord = userId
  }
  const payments = await Payment.find(filter)
  return payments
}

export const PaymentService = {
  createCheckoutSession,
  getTransactionsForUser
}
