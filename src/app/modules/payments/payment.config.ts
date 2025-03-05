import Stripe from 'stripe'

import { configuration } from '../../config/config'

export const stripe = new Stripe(configuration.stripe.secretKey as string, {
  apiVersion: '2025-02-24.acacia'
})
