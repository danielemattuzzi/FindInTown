const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); 
const passportController = require('../controllers/passportController');

// API: POST /auth/register to register in a user
router.post('/register', authController.register);
// API: POST /auth/login to log in a user
router.post('/login', authController.login);

// API: GET /auth/google to log in with Google
router.get('/google', passportController.googleLogin);
// API: GET /auth/google/callback to handle the Google callback 
// NOTE: the callback URL must be the same as the one set in the Google Developer Console
router.get('/google/callback', passportController.googleCallback); 


module.exports = router; 