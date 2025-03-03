import { Router } from 'express'

import Authentication from '../../middlewares/authentication'
import validateRequest from '../../middlewares/validateRequest'

import { AuthController } from './auth.controller'
import { UserRole } from './auth.user.interface'
import { AuthValidation } from './auth.validation'

const router = Router()

router.post(
  '/register',
  validateRequest(AuthValidation.registerUserZodSchema),
  AuthController.registerUser
)

router.post(
  '/login',
  // validateRequest(AuthValidation.loginUserZodSchema),
  AuthController.loginUser
)

router.post('/deactivate/:id', Authentication(UserRole.ADMIN), AuthController.deactivateUser)

router.patch(
  '/update-profile',
  Authentication(UserRole.LANDLORD, UserRole.TENANT),
  validateRequest(AuthValidation.updateProfileZodSchema),
  AuthController.updateProfile
)

router.patch(
  '/update-password',
  Authentication(UserRole.LANDLORD, UserRole.TENANT),
  AuthController.updatePassword
)

router.get('/getAll', Authentication(UserRole.ADMIN), AuthController.getAllUsers)

router.patch('/:id/role', Authentication(UserRole.ADMIN), AuthController.updateRole)

router.patch('/:id/active', Authentication(UserRole.ADMIN), AuthController.updateActive)

export const AuthRoutes = router
