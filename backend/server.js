require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const eventRoutes = require('./routes/events'); 
const userRoutes = require('./routes/users');
const ratingRoutes = require('./routes/ratings');
const authRoutes = require('./routes/auth'); 
const cors = require('cors'); // Import CORS middleware

// Enable CORS for all routes
//app.use(cors());

// Add CORS middleware to allow requests from specific origins
app.use(cors({
  origin: 'http://localhost:5173', // frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));

// Middleware
app.use(express.json());

// MongoDB connection
const uri = process.env.MONGODB_URI; // MongoDB connection string from .env file

mongoose.connect(uri)
    .then(() => console.log('✅ Connesso a MongoDB'))
    .catch((err) => console.error('❌ Errore nella connessione', err));

// Routes
app.use('/map', eventRoutes);
app.use('/explore', ratingRoutes);
app.use('/user', userRoutes); 
app.use('/auth', authRoutes); 

// Start the server 
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});


module.exports = {app, server}; // Export the app for testing purposes