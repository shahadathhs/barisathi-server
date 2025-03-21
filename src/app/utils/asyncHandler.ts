import { NextFunction, Request, Response } from 'express'

import sendError from '../errors/sendError'
import simplifyError from '../errors/simplifyError'

// * A helper function to wrap async controllers
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(error => {
      const errorResponse = simplifyError(error)
      sendError(res, errorResponse)
      next(error)
    })
  }
}
