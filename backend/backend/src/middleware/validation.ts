import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

// User validation schemas
export const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 2 characters long',
    'string.max': 'Name cannot exceed 100 characters'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'string.empty': 'Email is required'
  }),
  password: Joi.string().min(6).max(255).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters long',
    'string.max': 'Password cannot exceed 255 characters'
  }),
  role: Joi.string().valid('admin', 'user', 'guide', 'customer').default('user'),
  age: Joi.number().integer().min(1).max(120).optional(),
  address: Joi.string().max(500).optional(),
  profile_url: Joi.string().max(500).optional()
});

export const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).max(255).optional(),
  role: Joi.string().valid('admin', 'user', 'guide', 'customer').optional(),
  age: Joi.number().integer().min(1).max(120).optional(),
  address: Joi.string().max(500).optional(),
  profile_url: Joi.string().max(500).optional()
}).min(1); // At least one field must be provided

export const userIdSchema = Joi.object({
  id: Joi.number().integer().positive().required()
});

// Validation middleware
export const validateCreateUser = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = createUserSchema.validate(req.body);
  
  if (error) {
    res.status(400).json({
      success: false,
      message: 'Validation error',
      error: error.details[0].message,
      details: error.details
    });
    return;
  }
  
  next();
};

export const validateUpdateUser = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = updateUserSchema.validate(req.body);
  
  if (error) {
    res.status(400).json({
      success: false,
      message: 'Validation error',
      error: error.details[0].message,
      details: error.details
    });
    return;
  }
  
  next();
};

export const validateUserId = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = userIdSchema.validate({ id: parseInt(req.params.id) });
  
  if (error) {
    res.status(400).json({
      success: false,
      message: 'Invalid user ID',
      error: error.details[0].message
    });
    return;
  }
  
  next();
};
