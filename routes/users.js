const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const { verifyToken } = require('../middleware/auth'); // Import JWT verification middleware

// replaced these methods with the ones from usersController
// API: GET /user/profile to get all user profiles
// API: POST /user/profile to create a new user profile
// router.post('/profile', usersController.createUser);
// TODO: delete this route when the project is finished
router.get('/profile', usersController.getAllUsers);

// API: GET /user/me to get current user profile
router.get('/me', verifyToken, usersController.getCurrentUser);
// API: PUT /user/me to update current user profile
router.put('/me', verifyToken, usersController.updateCurrentUser);
// API: DELETE /user/me to delete current user profile
router.delete('/me', verifyToken, usersController.deleteCurrentUser);

// API: GET /user/profile/:id to get user profile
router.get('/profile/:userId', usersController.getUserById);
// API: PUT /user/profile/:id to update user profile
// router.put('/profile/:id', verifyToken, usersController.updateUser);
// API: DELETE /user/profile/:id to delete user profile
// router.delete('/profile/:userId',verifyToken, usersController.deleteUser);

module.exports = router;