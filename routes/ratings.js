const express = require('express');
const router = express.Router();
const ratingsController = require('../controllers/ratingsController');
const { verifyToken } = require('../middleware/auth');

// API: GET /explore/rating/:eventId to get all ratings for an event
router.get('/rating/:eventId', ratingsController.createRating);

// API: POST /explore/rating to create a new rating
router.post('/rating', verifyToken, ratingsController.createNewRating);
// API: DELETE /explore/rating/:ratingId to delete a rating
router.delete('/rating/:ratingId', verifyToken, ratingsController.deleteRating);

module.exports = router;