const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

// API: GET /user/profile to get all user profiles
router.get('/profile', usersController.getAllUsers);
// API: GET /user/profile/:id to get user profile
router.get('/profile/:userId', usersController.getUserById);
// API: POST /user/profile to create a new user profile
router.post('/profile', usersController.createUser);
// API: PUT /user/profile/:id to update user profile
router.put('/profile/:userId', usersController.updateUser);
// API: DELETE /user/profile/:id to delete user profile
router.delete('/profile/:userId', usersController.deleteUser);

module.exports = router;