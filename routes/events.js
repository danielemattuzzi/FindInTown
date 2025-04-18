const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsController');

// API: GET /map/events with filter for category and date
router.get('/events', eventsController.getAllEvents);
// API: POST /map/events to create a new event
router.post('/events', eventsController.createEvent);
// API: GET /map/events/:id to get event details
router.get('/events/:eventId', eventsController.getEventDetails);
// API: DELETE /map/events/:id to delete an event
router.delete('/events/:eventId', eventsController.deleteEvent); 

module.exports = router;