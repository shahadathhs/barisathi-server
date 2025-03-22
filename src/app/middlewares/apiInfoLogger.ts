import { Request, Response, NextFunction } from 'express'
import winston from 'winston'

import { configuration } from '../config/config'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [new winston.transports.Console()]
})

const apiInfoLogger = (req: Request, res: Response, next: NextFunction) => {
  // Log request details
  const logDetails = {
    method: req.method,
    url: req.url,
    body: req.body && Object.keys(req.body).length > 0 ? req.body : 'N/A',
    query: req.query && Object.keys(req.query).length > 0 ? req.query : 'N/A',
    params: req.params && Object.keys(req.params).length > 0 ? req.params : 'N/A',
    token: configuration.env === 'development' ? req.headers.authorization || 'N/A' : null,
    cookies: configuration.env === 'development' ? req.cookies || 'N/A' : null
  }

  logger.info(JSON.stringify({ type: 'request', logDetails }, null, 2)) // JSON log format

  // Capture response body safely
  let responseBody: unknown = null
  const originalSend = res.send.bind(res)
  const originalJson = res.json.bind(res)

  res.send = function (body: unknown): Response {
    if (!res.headersSent) {
      responseBody = body
      return originalSend(body)
    }
    return res
  }

  res.json = function (body: unknown): Response {
    if (!res.headersSent) {
      responseBody = body
      return originalJson(body)
    }
    return res
  }

  res.on('finish', () => {
    const responseLog = {
      type: 'response',
      statusCode: res.statusCode,
      responseBody: responseBody ? responseBody : 'No response body',
      responseHeaders: res.getHeaders()
    }

    logger.info(JSON.stringify(responseLog, null, 2)) // JSON log format
  })

  next()
}

export default apiInfoLogger
