import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

// Rate limiter configuration
export const createRateLimiter = () => {
  return rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
    message: {
      success: false,
      message: 'Too many requests from this IP, please try again later.',
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req: Request, res: Response) => {
      res.status(429).json({
        success: false,
        message: 'Too many requests from this IP, please try again later.',
        retryAfter: Math.round(parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000') / 1000)
      });
    }
  });
};

// Specific rate limiters for different endpoints
export const createUserRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 account creation requests per hour
  message: {
    success: false,
    message: 'Too many accounts created from this IP, please try again after an hour.',
  },
});
