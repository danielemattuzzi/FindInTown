const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsController');
const { verifyToken } = require('../middleware/auth');


// API: DELETE /map/events/:id to delete an event
// router.delete('/events/:eventId', eventsController.deleteEvent); 
// API: POST /map/events to create a new event
// router.post('/events', eventsController.createEvent);

// all the above route are replace using the verifyToken middleware 
// API: POST /map/events to create a new event
router.post('/events', verifyToken, eventsController.createEvent);
// API: PUT /map/events/:id to update an event only if the user is the organizer
router.put('/events/:eventId', verifyToken, eventsController.updateEvent);
// API: DELETE /map/events/:id to delete an event
router.delete('/events/:eventId', verifyToken, eventsController.deleteEvent);


// API: GET /map/events with filter for category and date
router.get('/events', eventsController.getAllEvents); 
// API: GET /map/events/:id to get event details
router.get('/events/:eventId', eventsController.getEventDetails);


module.exports = router;