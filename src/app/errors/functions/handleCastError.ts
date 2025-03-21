import mongoose from 'mongoose'

import { httpStatusCode } from '../../enum/statusCode'
import { IErrorResponse, IErrorSource } from '../../interface/error'

const handleCastError = (error: mongoose.Error.CastError): IErrorResponse => {
  const errorSources: IErrorSource[] = [
    {
      path: error.path,
      message: `Invalid value for the field '${error.path}'. Expected a valid ${error.kind}.`
    }
  ]

  return {
    statusCode: httpStatusCode.BAD_REQUEST,
    message: 'Invalid input data.',
    errorSources
  }
}

export default handleCastError
