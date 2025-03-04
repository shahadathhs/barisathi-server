import { NextFunction, Request, Response } from 'express'

import { httpStatusCode } from '../../enum/statusCode'
import sendError from '../../errorHandling/sendError'
import simplifyError from '../../errorHandling/simplifyError'
import sendResponse from '../../utils/sendResponse'

import { AuthService } from './auth.service'

// * Register a new user
const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AuthService.registerUser(req.body)

    sendResponse(res, {
      statusCode: httpStatusCode.CREATED,
      success: true,
      message: 'Registration successful.',
      data: result
    })
  } catch (error) {
    const errorResponse = simplifyError(error)
    sendError(res, errorResponse)
    next(error)
  }
}

// * Login an existing user
const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AuthService.loginUser(req.body)

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'Login successful.',
      data: result
    })
  } catch (error) {
    const errorResponse = simplifyError(error)
    sendError(res, errorResponse)
    next(error)
  }
}

// * Update user profile (Accessible to Landlords and Tenants)
const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user
    const { userId: id } = user
    const result = await AuthService.updateProfile(id, req.body)

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'User profile updated successfully.',
      data: result
    })
    next()
  } catch (error) {
    const errorResponse = simplifyError(error)
    sendError(res, errorResponse)
    next(error)
  }
}

// * Update user password (Accessible to Landlords and Tenants)
const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user
    const { userId: id } = user
    const result = await AuthService.updatePassword(id, req.body)

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'Password updated successfully.',
      data: result
    })
    next()
  } catch (error) {
    const errorResponse = simplifyError(error)
    sendError(res, errorResponse)
    next(error)
  }
}

// * Update user delete status (Accessible to Landlords and Tenants)
const updateDeletedStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const result = await AuthService.updateDeletedStatus(id)

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'User deactivated successfully.',
      data: result
    })
  } catch (error) {
    const errorResponse = simplifyError(error)
    sendError(res, errorResponse)
    next(error)
  }
}

// * Retrieve all users (Admin only)
const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AuthService.getAllUsers(req.query)
    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'Users retrieved successfully.',
      data: result
    })
    next()
  } catch (error) {
    const errorResponse = simplifyError(error)
    sendError(res, errorResponse)
    next(error)
  }
}

// * Update user role (Admin only)
const updateRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const result = await AuthService.updateRole(id, req.body)

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'User role updated successfully.',
      data: result
    })
    next()
  } catch (error) {
    const errorResponse = simplifyError(error)
    sendError(res, errorResponse)
    next(error)
  }
}

// * Update user active status (Admin only)
const updateActiveStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const result = await AuthService.updateActiveStatus(id)
    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'User status updated successfully.',
      data: result
    })
    next()
  } catch (error) {
    const errorResponse = simplifyError(error)
    sendError(res, errorResponse)
    next(error)
  }
}

export const AuthController = {
  registerUser,
  loginUser,
  updateProfile,
  updatePassword,
  updateDeletedStatus,
  getAllUsers,
  updateRole,
  updateActiveStatus
}
