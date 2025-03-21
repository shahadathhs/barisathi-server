import { Request, Response, NextFunction } from 'express'
import { ZodSchema } from 'zod'

import sendError from '../errors/sendError'
import simplifyError from '../errors/simplifyError'

export default function validateRequest(schema: ZodSchema) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        cookies: req.cookies
      })
      next()
    } catch (error) {
      const errorResponse = simplifyError(error)
      sendError(res, errorResponse)
      next(error)
    }
  }
}
