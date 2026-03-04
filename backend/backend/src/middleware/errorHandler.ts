import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export interface ApiError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = { ...err };
  error.message = err.message;

  logger.error(`Error ${err.message}`, {
    method: req.method,
    url: req.url,
    ip: req.ip,
    stack: err.stack
  });

  // Default error
  let statusCode = 500;
  let message = 'Internal Server Error';

  // Validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
  }

  // Database connection error
  if (err.message && err.message.includes('Connection failed')) {
    statusCode = 503;
    message = 'Database connection failed';
  }

  // Duplicate key error
  if (err.message && err.message.includes('duplicate')) {
    statusCode = 409;
    message = 'Resource already exists';
  }

  // Not found error
  if (err.message && err.message.includes('not found')) {
    statusCode = 404;
    message = 'Resource not found';
  }

  // Custom status code
  if (err.statusCode) {
    statusCode = err.statusCode;
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new Error(`Not found - ${req.originalUrl}`) as ApiError;
  error.statusCode = 404;
  next(error);
};
