import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { hanaConnection } from '../config/database';
import { CreateUserRequest, UpdateUserRequest, UserResponse } from '../models/User';
import { logger } from '../utils/logger';

export class UserController {
  // Create a new user
  static async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userData: CreateUserRequest = req.body;
      
      logger.info('Creating user with data:', userData);
      
      // Hash password
      const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
      
      const query = `
        INSERT INTO "USERS" (
          "NAME", "EMAIL", "PASSWORD", "ROLE", "AGE", "ADDRESS", "PROFILE_URL", "CREATED_AT", "UPDATED_AT"
        ) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `;
      
      const params = [
        userData.name,
        userData.email,
        hashedPassword,
        userData.role || 'user',
        userData.age || null,
        userData.address || null,
        userData.profile_url || null
      ];
      
      await hanaConnection.query(query, params);
      
      // Fetch the created user (without password)
      const selectQuery = `
        SELECT "ID", "NAME", "EMAIL", "ROLE", "AGE", "ADDRESS", "PROFILE_URL", "CREATED_AT", "UPDATED_AT"
        FROM "USERS" 
        WHERE "EMAIL" = ?
      `;
      
      const result = await hanaConnection.query(selectQuery, [userData.email]);
      
      if (result.length === 0) {
        throw new Error('Failed to create user');
      }
      
      // Map SAP HANA column names to response format
      const dbResult = result[0];
      const user: UserResponse = {
        id: dbResult.ID,
        name: dbResult.NAME,
        email: dbResult.EMAIL,
        role: dbResult.ROLE,
        age: dbResult.AGE,
        address: dbResult.ADDRESS,
        profile_url: dbResult.PROFILE_URL,
        created_at: dbResult.CREATED_AT,
        updated_at: dbResult.UPDATED_AT
      };
      
      logger.info(`User created successfully: ${user.email}`);
      
      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: user
      });
    } catch (error: any) {
      logger.error('Error creating user:', error);
      next(error);
    }
  }
  
  // Get all users
  static async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = `
        SELECT "ID", "NAME", "EMAIL", "ROLE", "AGE", "ADDRESS", "PROFILE_URL", "CREATED_AT", "UPDATED_AT"
        FROM "USERS"
        ORDER BY "CREATED_AT" DESC
      `;
      
      const result = await hanaConnection.query(query);
      
      // Map SAP HANA column names to response format
      const users = result.map((dbUser: any) => ({
        id: dbUser.ID,
        name: dbUser.NAME,
        email: dbUser.EMAIL,
        role: dbUser.ROLE,
        age: dbUser.AGE,
        address: dbUser.ADDRESS,
        profile_url: dbUser.PROFILE_URL,
        created_at: dbUser.CREATED_AT,
        updated_at: dbUser.UPDATED_AT
      }));
      
      res.status(200).json({
        success: true,
        message: 'Users retrieved successfully',
        data: users,
        count: users.length
      });
    } catch (error: any) {
      logger.error('Error fetching users:', error);
      next(error);
    }
  }
  
  // Get user by ID
  static async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = parseInt(req.params.id);
      
      const query = `
        SELECT "ID", "NAME", "EMAIL", "ROLE", "AGE", "ADDRESS", "PROFILE_URL", "CREATED_AT", "UPDATED_AT"
        FROM "USERS" 
        WHERE "ID" = ?
      `;
      
      const result = await hanaConnection.query(query, [userId]);
      
      if (result.length === 0) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }
      
      // Map SAP HANA column names to response format
      const dbUser = result[0];
      const user: UserResponse = {
        id: dbUser.ID,
        name: dbUser.NAME,
        email: dbUser.EMAIL,
        role: dbUser.ROLE,
        age: dbUser.AGE,
        address: dbUser.ADDRESS,
        profile_url: dbUser.PROFILE_URL,
        created_at: dbUser.CREATED_AT,
        updated_at: dbUser.UPDATED_AT
      };
      
      res.status(200).json({
        success: true,
        message: 'User retrieved successfully',
        data: user
      });
    } catch (error: any) {
      logger.error('Error fetching user:', error);
      next(error);
    }
  }
  
  // Update user
  static async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = parseInt(req.params.id);
      const updateData: UpdateUserRequest = req.body;
      
      logger.info(`Updating user ${userId} with data:`, updateData);
      
      // Check if user exists
      const checkQuery = 'SELECT "ID" FROM "USERS" WHERE "ID" = ?';
      const existingUser = await hanaConnection.query(checkQuery, [userId]);
      
      if (existingUser.length === 0) {
        logger.warn(`User ${userId} not found`);
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }
      
      // Build dynamic update query
      const updateFields: string[] = [];
      const updateValues: any[] = [];
      
      if (updateData.name !== undefined && updateData.name !== '') {
        updateFields.push('"NAME" = ?');
        updateValues.push(updateData.name);
      }
      
      if (updateData.email !== undefined && updateData.email !== '') {
        updateFields.push('"EMAIL" = ?');
        updateValues.push(updateData.email);
      }
      
      if (updateData.password !== undefined && updateData.password !== '') {
        const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
        const hashedPassword = await bcrypt.hash(updateData.password, saltRounds);
        updateFields.push('"PASSWORD" = ?');
        updateValues.push(hashedPassword);
      }
      
      if (updateData.role !== undefined && updateData.role !== '') {
        updateFields.push('"ROLE" = ?');
        updateValues.push(updateData.role);
      }
      
      if (updateData.age !== undefined && updateData.age !== null) {
        updateFields.push('"AGE" = ?');
        updateValues.push(updateData.age);
      }
      
      if (updateData.address !== undefined) {
        updateFields.push('"ADDRESS" = ?');
        updateValues.push(updateData.address || null);
      }
      
      if (updateData.profile_url !== undefined) {
        updateFields.push('"PROFILE_URL" = ?');
        updateValues.push(updateData.profile_url || null);
      }
      
      // Add updated_at field
      updateFields.push('"UPDATED_AT" = CURRENT_TIMESTAMP');
      
      // Check if we have any fields to update
      if (updateFields.length === 1) { // Only UPDATED_AT
        res.status(400).json({
          success: false,
          message: 'No valid fields provided for update'
        });
        return;
      }
      
      // Add userId for WHERE clause
      updateValues.push(userId);
      
      const updateQuery = `
        UPDATE "USERS" 
        SET ${updateFields.join(', ')}
        WHERE "ID" = ?
      `;
      
      logger.info(`Executing update query: ${updateQuery}`);
      logger.info(`Update values:`, updateValues);
      
      await hanaConnection.query(updateQuery, updateValues);
      
      // Fetch updated user
      const selectQuery = `
        SELECT "ID", "NAME", "EMAIL", "ROLE", "AGE", "ADDRESS", "PROFILE_URL", "CREATED_AT", "UPDATED_AT"
        FROM "USERS" 
        WHERE "ID" = ?
      `;
      
      const result = await hanaConnection.query(selectQuery, [userId]);
      
      // Map SAP HANA column names to response format
      const dbUser = result[0];
      const updatedUser: UserResponse = {
        id: dbUser.ID,
        name: dbUser.NAME,
        email: dbUser.EMAIL,
        role: dbUser.ROLE,
        age: dbUser.AGE,
        address: dbUser.ADDRESS,
        profile_url: dbUser.PROFILE_URL,
        created_at: dbUser.CREATED_AT,
        updated_at: dbUser.UPDATED_AT
      };
      
      logger.info(`User updated successfully: ${updatedUser.email}`);
      
      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: updatedUser
      });
    } catch (error: any) {
      logger.error('Error updating user:', error);
      next(error);
    }
  }
  
  // Delete user
  static async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = parseInt(req.params.id);
      
      // Check if user exists
      const checkQuery = 'SELECT "ID", "EMAIL" FROM "USERS" WHERE "ID" = ?';
      const existingUser = await hanaConnection.query(checkQuery, [userId]);
      
      if (existingUser.length === 0) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }
      
      const deleteQuery = 'DELETE FROM "USERS" WHERE "ID" = ?';
      await hanaConnection.query(deleteQuery, [userId]);
      
      logger.info(`User deleted successfully: ${existingUser[0].email}`);
      
      res.status(200).json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error: any) {
      logger.error('Error deleting user:', error);
      next(error);
    }
  }
}
