require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const eventRoutes = require('./routes/events'); 
const userRoutes = require('./routes/users');
const ratingRoutes = require('./routes/ratings');
const authRoutes = require('./routes/auth'); // Import auth routes
const { verifyToken } = require('./middleware/auth'); // Import JWT verification middleware

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

// Authentication routes
// app.use('/auth', authRoutes); // Use auth routes

// Start the server 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
}); 

