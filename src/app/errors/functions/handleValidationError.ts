import mongoose from 'mongoose'

import { httpStatusCode } from '../../utils/enum/statusCode'
import { IErrorResponse, IErrorSource } from '../../utils/interface/error'

const handleValidationError = (err: mongoose.Error.ValidationError): IErrorResponse => {
  const errorSources: IErrorSource[] = Object.values(err.errors).map(
    (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: val?.path,
        message: val?.message
      }
    }
  )

  return {
    statusCode: httpStatusCode.BAD_REQUEST,
    message: 'Validation Error',
    errorSources
  }
}

export default handleValidationError
