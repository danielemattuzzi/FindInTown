const request = require('supertest');
const mongoose = require('mongoose');
const {app, server} = require('../server'); 
const Event = require('../models/Event'); 
const User = require('../models/User');  
require('dotenv').config();

let testUser;
let testToken;
let testEvent;

describe('Events API', () => {
  // Setup: Connect to test database, create test user before all tests
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Create a test user
    testUser = await User.create({
      name: 'Test User',
      email: 'test.events@example.com',
      password: 'testPassword123'
    });
    
    // Get authentication token
    const loginResponse = await request(app)
      .post('/auth/login')
      .send({
        email: 'test.events@example.com',
        password: 'testPassword123'
      });
    
    testToken = loginResponse.body.token;
  });

  // Clean up after tests
  afterAll(async () => {
    // Delete test user and event
    await User.findByIdAndDelete(testUser._id);
    if (testEvent) {
      await Event.findByIdAndDelete(testEvent._id);
    }
    
    // Close database connection
    await mongoose.connection.close();  
    server.close(); // Close the server
  });

  // Test creating a new event
  describe('POST /map/events', () => {
    it('should create a new event when authenticated', async () => {
      const eventData = {
        title: 'Test Event',
        description_short: 'Short description for test',
        description_long: 'Longer description for test event',
        image: 'https://example.com/image.jpg',
        location_text: 'Test Location',
        location: {
          type: 'Point',
          coordinates: [11.1230, 46.0759]
        },
        date: new Date().toISOString(),
        category: 'test'
      };

      const response = await request(app)
        .post('/map/events')
        .set('Authorization', `Bearer ${testToken}`)
        .send(eventData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.title).toBe(eventData.title);
      expect(response.body.organizer).toBe(testUser._id.toString());

      // Save test event ID for later tests
      testEvent = response.body;
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .post('/map/events')
        .send({
          title: 'Unauthorized Event',
          description_short: 'Short description',
          location: {
            type: 'Point',
            coordinates: [11.1230, 46.0759]
          },
          date: new Date().toISOString(),
          category: 'test'
        });

      expect(response.status).toBe(401);
    });
  });

  // Test getting all events
  describe('GET /map/events', () => {
    it('should retrieve all events', async () => {
      const response = await request(app).get('/map/events');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
    });

    it('should filter events by category', async () => {
      const response = await request(app)
        .get('/map/events')
        .query({ category: 'test' });
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      
      // All returned events should have the test category
      response.body.forEach(event => {
        expect(event.category).toBe('test');
      });
    });

    it('should filter events by date', async () => {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

      const response = await request(app)
        .get('/map/events')
        .query({ date: today });
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
    });

    it('should filter events by title', async () => {
      const response = await request(app)
        .get('/map/events')
        .query({ title: 'Test' });
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      
      // All returned events should have 'Test' in the title
      response.body.forEach(event => {
        expect(event.title.toLowerCase()).toContain('test');
      });
    });
  });

  // Test getting a specific event
  describe('GET /map/events/:eventId', () => {
    it('should retrieve a specific event by ID', async () => {
      if (!testEvent) {
        throw new Error('Test event was not created successfully');
      }

      const response = await request(app)
        .get(`/map/events/${testEvent._id}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('_id', testEvent._id);
      expect(response.body.title).toBe(testEvent.title);
    });

    it('should return 404 for non-existent event ID', async () => {
      // Using a valid but non-existent ObjectId
      const nonExistentId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .get(`/map/events/${nonExistentId}`);
      
      expect(response.status).toBe(404);
    });

    it('should return 400 for invalid event ID format', async () => {
      const response = await request(app)
        .get('/map/events/invalidid');
      
      expect(response.status).toBe(400);
    });
  });

  // Test updating an event
  describe('PUT /map/events/:eventId', () => {
    it('should update an event when user is the organizer', async () => {
      if (!testEvent) {
        throw new Error('Test event was not created successfully');
      }

      const updateData = {
        title: 'Updated Test Event',
        description_short: 'Updated short description'
      };

      const response = await request(app)
        .put(`/map/events/${testEvent._id}`)
        .set('Authorization', `Bearer ${testToken}`)
        .send(updateData);
      
      expect(response.status).toBe(200);
      expect(response.body.title).toBe(updateData.title);
      expect(response.body.description_short).toBe(updateData.description_short);
    });

    it('should return 401 when not authenticated', async () => {
      if (!testEvent) {
        throw new Error('Test event was not created successfully');
      }

      const response = await request(app)
        .put(`/map/events/${testEvent._id}`)
        .send({ title: 'Unauthorized Update' });
      
      expect(response.status).toBe(401);
    });
  });

  // Test deleting an event
  describe('DELETE /map/events/:eventId', () => {
    it('should delete an event when user is the organizer', async () => {
      if (!testEvent) {
        throw new Error('Test event was not created successfully');
      }

      const response = await request(app)
        .delete(`/map/events/${testEvent._id}`)
        .set('Authorization', `Bearer ${testToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Evento eliminato');

      // Verify event was actually deleted
      const checkEvent = await Event.findById(testEvent._id);
      expect(checkEvent).toBeNull();
      
      // Clear testEvent since it's now deleted
      testEvent = null;
    });

    it('should return 401 when not authenticated', async () => {
      // Create a new event to delete since the previous one was already deleted
      const eventData = {
        title: 'Event to Delete',
        description_short: 'Short description',
        description_long: 'Long description',
        image: 'https://example.com/image.jpg',
        location_text: 'Test Location',
        location: {
          type: 'Point',
          coordinates: [11.1230, 46.0759]
        },
        date: new Date().toISOString(),
        category: 'test'
      };

      const createResponse = await request(app)
        .post('/map/events')
        .set('Authorization', `Bearer ${testToken}`)
        .send(eventData);

      testEvent = createResponse.body;

      const response = await request(app)
        .delete(`/map/events/${testEvent._id}`);
      
      expect(response.status).toBe(401);

      // Clean up the event
      await request(app)
        .delete(`/map/events/${testEvent._id}`)
        .set('Authorization', `Bearer ${testToken}`);
      
      testEvent = null;
    });
  });
});

