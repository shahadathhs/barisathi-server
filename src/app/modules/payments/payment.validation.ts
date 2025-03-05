import { z } from 'zod'

const createCheckoutSessionSchema = z.object({
  body: z.object({
    bookingId: z.string({ required_error: 'Booking ID is required' }),
    amount: z.number({ required_error: 'Amount is required' }),
    currency: z.string({ required_error: 'Currency is required' }),
    email: z
      .string({ required_error: 'Email is required' })
      .email({ message: 'Invalid email address' }),
    tenantId: z.string({ required_error: 'Tenant ID is required' }),
    landlordId: z.string({ required_error: 'Landlord ID is required' })
  })
})

export const PaymentValidation = {
  createCheckoutSessionSchema
}
