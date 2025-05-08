import { asyncHandler } from 'app/utils/asyncHandler'
import { httpStatusCode } from 'app/utils/enum/statusCode'
import sendResponse from 'app/utils/sendResponse'
import { NextFunction, Request, Response } from 'express'

import { AnalyticsService } from './analytics.service'

const getAdminAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  const result = await AnalyticsService.getAdminAnalytics()
  sendResponse(res, {
    statusCode: httpStatusCode.OK,
    success: true,
    message: 'Admin analytics retrieved successfully.',
    data: result
  })
  next()
}

export const AnalyticsController = {
  getAdminAnalytics: asyncHandler(getAdminAnalytics)
}
