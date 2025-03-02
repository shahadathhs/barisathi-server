import { Router } from 'express'

import { AuthRoutes } from '../modules/auth/auth.route'
import { paymentRoutes } from '../modules/payments/payment.route'

const appRoutes = Router()

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes
  },
  {
    path: '/payments',
    route: paymentRoutes
  }
]

moduleRoutes.forEach(route => appRoutes.use(route.path, route.route))

export default appRoutes
