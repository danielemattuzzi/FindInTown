const request = require('supertest');
const mongoose = require('mongoose');
const {app, server} = require('../server');
const Rating = require('../models/Rating');
const Event = require('../models/Event');
const User = require('../models/User');
require('dotenv').config();

let testUser;
let testToken;
let testEvent;
let testRating;

describe('Ratings API', () => {
  // Setup: Connect to test database, create test user and event before all tests
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Create a test user
    testUser = await User.create({
      name: 'Test User',
      email: 'test.ratings@example.com',
      password: 'testPassword123'
    });
    
    // Get authentication token
    const loginResponse = await request(app)
      .post('/auth/login')
      .send({
        email: 'test.ratings@example.com',
        password: 'testPassword123'
      });
    
    testToken = loginResponse.body.token;

    // Create a test event
    testEvent = await Event.create({
      title: 'Test Event for Rating',
      description_short: 'Short description for test',
      description_long: 'Longer description for test event',
      image: 'https://example.com/image.jpg',
      location_text: 'Test Location',
      location: {
        type: 'Point',
        coordinates: [11.1230, 46.0759]
      },
      category: 'test',
      date: new Date(),
      organizer: testUser._id
    });
  });

  // Clean up after tests
  afterAll(async () => {
    // Delete test user, event, and rating
    await User.findByIdAndDelete(testUser._id);
    await Event.findByIdAndDelete(testEvent._id);
    if (testRating) {
      await Rating.findByIdAndDelete(testRating._id);
    }
    
    // Close database connection and server
    await mongoose.connection.close();
    server.close();
  });

  // Test creating a new rating
  describe('POST /explore/rating', () => {
    it('should create a new rating when authenticated', async () => {
      const ratingData = {
        event_id: testEvent._id,
        stars: 4,
        comment: 'Great test event!'
      };

      const response = await request(app)
        .post('/explore/rating')
        .set('Authorization', `Bearer ${testToken}`)
        .send(ratingData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.stars).toBe(ratingData.stars);
      expect(response.body.comment).toBe(ratingData.comment);
      expect(response.body.user_id.toString()).toBe(testUser._id.toString());
      expect(response.body.event_id.toString()).toBe(testEvent._id.toString());

      // Save test rating ID for later tests
      testRating = response.body;
    });

    it('should prevent duplicate ratings from the same user for the same event', async () => {
      const ratingData = {
        event_id: testEvent._id,
        stars: 5,
        comment: 'Attempting duplicate rating'
      };

      const response = await request(app)
        .post('/explore/rating')
        .set('Authorization', `Bearer ${testToken}`)
        .send(ratingData);

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('error', 'Hai già valutato questo evento');
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .post('/explore/rating')
        .send({
          event_id: testEvent._id,
          stars: 3,
          comment: 'Unauthorized rating'
        });

      expect(response.status).toBe(401);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/explore/rating')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          // Missing required fields
        });

      expect(response.status).toBe(422);
    });
  });

  // Test getting ratings for an event
  describe('GET /explore/rating/:eventId', () => {
    it('should retrieve all ratings for an event', async () => {
      const response = await request(app)
        .get(`/explore/rating/${testEvent._id}`);
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBeGreaterThan(0);
      
      // Verify the structure of returned ratings
      const rating = response.body[0];
      expect(rating).toHaveProperty('stars');
      expect(rating).toHaveProperty('comment');
      expect(rating).toHaveProperty('user_id');
      expect(rating).toHaveProperty('event_id');
    });

    it('should return empty array for event with no ratings', async () => {
      // Create a new event without ratings
      const newEvent = await Event.create({
        title: 'Event Without Ratings',
        description_short: 'Short description',
        description_long: 'Long description',
        image: 'https://example.com/image.jpg',
        location_text: 'Test Location',
        location: {
          type: 'Point',
          coordinates: [11.1230, 46.0759]
        },
        category: 'test',
        date: new Date(),
        organizer: testUser._id
      });

      const response = await request(app)
        .get(`/explore/rating/${newEvent._id}`);
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBe(0);

      // Clean up
      await Event.findByIdAndDelete(newEvent._id);
    });
  });

  // Test deleting a rating
  describe('DELETE /explore/rating/:ratingId', () => {
    it('should delete a rating when user is the owner', async () => {
      if (!testRating) {
        throw new Error('Test rating was not created successfully');
      }

      const response = await request(app)
        .delete(`/explore/rating/${testRating._id}`)
        .set('Authorization', `Bearer ${testToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Valutazione eliminata');

      // Verify rating was actually deleted
      const checkRating = await Rating.findById(testRating._id);
      expect(checkRating).toBeNull();
      
      testRating = null;
    });

    it('should return 401 when not authenticated', async () => {
      // Create a new rating to try to delete
      const newRating = await Rating.create({
        event_id: testEvent._id,
        user_id: testUser._id,
        stars: 3,
        comment: 'Rating to delete'
      });

      const response = await request(app)
        .delete(`/explore/rating/${newRating._id}`);
      
      expect(response.status).toBe(401);

      // Clean up
      await Rating.findByIdAndDelete(newRating._id);
    });

    it('should return 404 for non-existent rating ID', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .delete(`/explore/rating/${nonExistentId}`)
        .set('Authorization', `Bearer ${testToken}`);
      
      expect(response.status).toBe(404);
    });
  });
});