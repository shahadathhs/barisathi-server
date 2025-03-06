import { Router } from 'express'

import { AuthRoutes } from '../modules/auth/auth.routes'
import { BookingRoutes } from '../modules/booking/booking.routes'
import { ListingRoutes } from '../modules/listing/listing.routes'
import { PaymentRoutes } from '../modules/payments/payment.route'

const appRoutes = Router()

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes
  },
  {
    path: '/listings',
    route: ListingRoutes
  },
  {
    path: '/bookings',
    route: BookingRoutes
  },
  {
    path: '/payments',
    route: PaymentRoutes
  }
]

moduleRoutes.forEach(route => appRoutes.use(route.path, route.route))

export default appRoutes
