import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { validateCreateUser, validateUpdateUser, validateUserId } from '../middleware/validation';
import { createUserRateLimiter } from '../middleware/rateLimiter';

const router = Router();

// @route   POST /api/users
// @desc    Create a new user
// @access  Public
router.post('/', 
  createUserRateLimiter, 
  validateCreateUser, 
  UserController.createUser
);

// @route   GET /api/users
// @desc    Get all users
// @access  Public
router.get('/', UserController.getAllUsers);

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Public
router.get('/:id', 
  validateUserId, 
  UserController.getUserById
);

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Public
router.put('/:id', 
  validateUserId, 
  validateUpdateUser, 
  UserController.updateUser
);

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Public
router.delete('/:id', 
  validateUserId, 
  UserController.deleteUser
);

export default router;
