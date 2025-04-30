const request = require('supertest');
const mongoose = require('mongoose');
const { app, server } = require('../server');
const User = require('../models/User');
require('dotenv').config();

let testUser;
let testUserToken;
let testAdminToken;
let testAdmin;

describe('Users API', () => {
  // Setup: Connect to test database and create test users
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Create a regular test user
    testUser = await User.create({
      name: 'Test User',
      email: 'test.user@example.com',
      password: 'password123'
    });
    
    // Create an admin test user
    testAdmin = await User.create({
      name: 'Admin User',
      email: 'admin.user@example.com',
      password: 'admin123',
      role: 'admin'
    });
    
    // Get authentication tokens
    const userLoginResponse = await request(app)
      .post('/auth/login')
      .send({
        email: 'test.user@example.com',
        password: 'password123'
      });
    
    const adminLoginResponse = await request(app)
      .post('/auth/login')
      .send({
        email: 'admin.user@example.com',
        password: 'admin123'
      });
    
    testUserToken = userLoginResponse.body.token;
    testAdminToken = adminLoginResponse.body.token;
  });

  // Clean up after tests
  afterAll(async () => {
    // Delete test users
    await User.findByIdAndDelete(testUser._id);
    await User.findByIdAndDelete(testAdmin._id);
    
    // Close database connection and server
    await mongoose.connection.close();
    server.close();
  });

  // Test authentication
  describe('Authentication', () => {
    it('should register a new user', async () => {
      const newUser = {
        name: 'New User',
        email: 'new.user@example.com',
        password: 'newpassword123'
      };

      const response = await request(app)
        .post('/auth/register')
        .send(newUser);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Utente registrato con successo');
      
      // Clean up: delete the created user
      await User.deleteOne({ email: 'new.user@example.com' });
    });

    it('should prevent registration with existing email', async () => {
      const duplicateUser = {
        name: 'Duplicate User',
        email: 'test.user@example.com', // Using existing email
        password: 'password123'
      };

      const response = await request(app)
        .post('/auth/register')
        .send(duplicateUser);
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Email già in uso');
    });

    it('should login user with valid credentials', async () => {
      const credentials = {
        email: 'test.user@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/auth/login')
        .send(credentials);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('name', 'Test User');
    });

    it('should reject login with invalid credentials', async () => {
      const invalidCredentials = {
        email: 'test.user@example.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/auth/login')
        .send(invalidCredentials);
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Credenziali non valide');
    });
  });

  // Test user profile access
  describe('GET /user/me', () => {
    it('should get current user profile when authenticated', async () => {
      const response = await request(app)
        .get('/user/me')
        .set('Authorization', `Bearer ${testUserToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('_id', testUser._id.toString());
      expect(response.body).toHaveProperty('name', 'Test User');
      expect(response.body).toHaveProperty('email', 'test.user@example.com');
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .get('/user/me');
      
      expect(response.status).toBe(401);
    });
  });

  // Test public profile access
  describe('GET /user/profile/:userId', () => {
    it('should get user profile by ID', async () => {
      const response = await request(app)
        .get(`/user/profile/${testUser._id}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', 'Test User');
      expect(response.body).toHaveProperty('email', 'test.user@example.com');
      expect(response.body).not.toHaveProperty('password');
    });

    it('should return 404 for non-existent user ID', async () => {
      // Using a valid but non-existent ObjectId
      const nonExistentId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .get(`/user/profile/${nonExistentId}`);
      
      expect(response.status).toBe(404);
    });
  });

  // Test profile updates
  describe('PUT /user/me', () => {
    it('should update current user profile when authenticated', async () => {
      const updateData = {
        name: 'Updated Test User',
        email: 'test.user@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .put('/user/me')
        .set('Authorization', `Bearer ${testUserToken}`)
        .send(updateData);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', 'Updated Test User');
      
      // Verify that name was actually updated in the database
      const updatedUser = await User.findById(testUser._id);
      expect(updatedUser.name).toBe('Updated Test User');
    });

    it('should return 401 when trying to update without authentication', async () => {
      const response = await request(app)
        .put('/user/me')
        .send({ name: 'Unauthorized Update' });
      
      expect(response.status).toBe(401);
    });
  });

  // Test admin-only functionality
  describe('GET /user/profile (admin access)', () => {
    it('should allow admin to get all user profiles', async () => {
      const response = await request(app)
        .get('/user/profile')
        .set('Authorization', `Bearer ${testAdminToken}`);
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBeGreaterThanOrEqual(2);
    });

    it('should prevent regular users from accessing all profiles', async () => {
      const response = await request(app)
        .get('/user/profile')
        .set('Authorization', `Bearer ${testUserToken}`);
      
      expect(response.status).toBe(403);
    });
  });

  // Test account deletion
  describe('DELETE /user/me', () => {
    it('should delete current user account when authenticated', async () => {
      // First create a temporary user
      const tempUser = await User.create({
        name: 'Temporary User',
        email: 'temp.user@example.com',
        password: 'temppass123'
      });
      
      // Login with the temp user
      const loginResponse = await request(app)
        .post('/auth/login')
        .send({
          email: 'temp.user@example.com',
          password: 'temppass123'
        });
      
      const tempToken = loginResponse.body.token;
      
      // Delete the account
      const response = await request(app)
        .delete('/user/me')
        .set('Authorization', `Bearer ${tempToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Utente eliminato con successo');
      
      // Verify the user is actually deleted
      const deletedUser = await User.findById(tempUser._id);
      expect(deletedUser).toBeNull();
    });

    it('should return 401 when trying to delete without authentication', async () => {
      const response = await request(app)
        .delete('/user/me');
      
      expect(response.status).toBe(401);
    });
  });
});
