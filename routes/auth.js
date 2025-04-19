const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// API: POST /auth/register to register in a user
router.post('/register', authController.register);
// API: POST /auth/login to log in a user
router.post('/login', authController.login);

module.exports = router; 