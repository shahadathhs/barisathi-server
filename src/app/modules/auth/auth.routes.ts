import { Router } from 'express'

import Authentication from '../../middlewares/authentication'
import validateRequest from '../../middlewares/validateRequest'

import { AuthController } from './auth.controller'
import { UserRole } from './auth.user.interface'
import { AuthValidation } from './auth.validation'

const router = Router()

// * Register a new user
router.post(
  '/register',
  validateRequest(AuthValidation.registerUserZodSchema),
  AuthController.registerUser
)

// * Login an existing user
router.post('/login', AuthController.loginUser)

// * Update user profile (Accessible to all authenticated users)
router.patch(
  '/update-profile',
  Authentication(UserRole.LANDLORD, UserRole.TENANT, UserRole.ADMIN),
  validateRequest(AuthValidation.updateProfileZodSchema),
  AuthController.updateProfile
)

// * Update user password (Accessible to all authenticated users)
router.patch(
  '/update-password',
  Authentication(UserRole.LANDLORD, UserRole.TENANT, UserRole.ADMIN),
  AuthController.updatePassword
)

// * Update user delete status (isDeleted property) (Accessible to Landlords and Tenants)
router.post(
  '/:id/delete',
  Authentication(UserRole.LANDLORD, UserRole.TENANT),
  AuthController.updateDeletedStatus
)

// * Retrieve all users (Admin only)
router.get('/getAll', Authentication(UserRole.ADMIN), AuthController.getAllUsers)

// * Update user role (Admin only)
router.patch('/:id/role', Authentication(UserRole.ADMIN), AuthController.updateRole)

// * Update user active status (isActive property) (Admin only)
router.patch('/:id/active', Authentication(UserRole.ADMIN), AuthController.updateActiveStatus)

export const AuthRoutes = router
