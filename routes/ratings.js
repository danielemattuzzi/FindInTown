const express = require('express');
const router = express.Router();
const ratingsController = require('../controllers/ratingsController');

// API: GET /explore/rating/:eventId to get all ratings for an event
router.get('/rating/:eventId', ratingsController.createRating);
// API: POST /explore/rating to create a new rating
router.post('/rating', ratingsController.createNewRating);
// API: DELETE /explore/rating/:ratingId to delete a rating
router.delete('/rating/:ratingId', ratingsController.deleteRating);

module.exports = router;