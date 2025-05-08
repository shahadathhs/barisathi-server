import Authentication from 'app/middlewares/authentication'
import { UserRole } from 'app/utils/enum/userRole'
import { Router } from 'express'

import { AnalyticsController } from './analytics.controller'

const router = Router()

router.get('/admin', Authentication(UserRole.ADMIN), AnalyticsController.getAdminAnalytics)

export const AnalyticsRoutes = router
