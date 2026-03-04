import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { hanaConnection } from './config/database';
import { logger } from './utils/logger';
import { errorHandler, notFound } from './middleware/errorHandler';
import { createRateLimiter } from './middleware/rateLimiter';
import routes from './routes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

// CORS configuration - more permissive for development
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.ALLOWED_ORIGINS?.split(',') || []
    : [
        'http://localhost:3000',
        'http://localhost:5173', 
        'http://localhost:5174',  // Admin app port
        'http://localhost:4173',
        'http://localhost:3001',
        'http://localhost:8080',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5174',  // Admin app IP
        'http://127.0.0.1:3000'
      ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
app.use(createRateLimiter());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

// API routes
app.use('/api', routes);

// Add a direct health endpoint for convenience
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Desi Guide Backend API',
    version: '1.0.0',
    documentation: '/api/health',
    endpoints: {
      health: 'GET /health or GET /api/health',
      users: {
        create: 'POST /api/users',
        getAll: 'GET /api/users',
        getById: 'GET /api/users/:id',
        update: 'PUT /api/users/:id',
        delete: 'DELETE /api/users/:id'
      }
    }
  });
});

// 404 handler (must be after all routes)
app.use(notFound);

// Error handling middleware (must be last)
app.use(errorHandler);

// Graceful shutdown
const gracefulShutdown = async () => {
  logger.info('Shutting down gracefully...');
  
  try {
    await hanaConnection.disconnect();
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start server
async function startServer() {
  try {
    // Initialize database connection
    await hanaConnection.initialize();
    
    // Create users table if it doesn't exist
    await hanaConnection.createUsersTable();
    
    // Test database connection
    const isConnected = await hanaConnection.testConnection();
    if (!isConnected) {
      throw new Error('Database connection test failed');
    }
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`✅ Backend running on port ${PORT}`);
      console.log(`✅ SAP HANA connection successful`);
      console.log(`✅ API: http://localhost:${PORT}/api`);
      
      logger.info(`Server running on port ${PORT}`);
      logger.info('SAP HANA connection successful');
    });
    
  } catch (error: any) {
    console.error('❌ Backend startup failed:', error.message || error);
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Initialize server
startServer();

export default app;
