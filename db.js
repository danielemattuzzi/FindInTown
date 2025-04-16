const mongoose = require('mongoose');
const express = require('express'); 
require('dotenv').config();

const uri = process.env.MONGODB_URI; // MongoDB connection string from .env file

mongoose.connect(uri)
    .then(() => console.log('✅ Connesso a MongoDB'))
    .catch((err) => console.error('❌ Errore nella connessione', err));

/*
// --------------- DEMO MOONGOOSE - CRUD OPERATIONS -----------------
// define the schema 
const { Schema, model } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

// to use the schema, we need to convert it to a model
const User = model('User', userSchema);


// CRUD Operations 
// Create
const newUser = new User({
    name : 'John Doe',
    email : 'email@example.com', 
    password : 'password123'
});
// Save the user to the database
newUser.save()
    .then(() => console.log('✅ Utente creato'))
    .catch((err) => console.error('❌ Errore nella creazione dell\'utente', err));

// Find the userId of "John Doe"
// Using async / await to 
async function updateAndDeleteUser() {
    try {
        // Find user by name: "John Doe"
        const user = await User.findOne({ name: 'John Doe' });

        if (user) {
            const userId = user._id;  // getting the ObjectId of the user
            console.log('✅ ObjectId di John:', userId);

            // 1. update User
            const updatedUser = await User.findByIdAndUpdate(userId, { name: 'Jane Doe' }, { new: true });
            console.log('✅ Utente aggiornato:', updatedUser);

            // 2. Delete after update
            await User.findByIdAndDelete(userId);
            console.log('✅ Utente eliminato');
        } else {
            console.log('❌ Utente non trovato');
        }
    } catch (err) {
        console.error('❌ Errore durante le operazioni:', err);
    }
}

// execute the function
updateAndDeleteUser();
*/ 

// --------------- MOONGOOSE - SCHEMA -----------------
// defining scheme described in the documentation (YAML file) 
const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  organizer: { type: Number, required: true },
  description_short: String,
  description_long: String,
  location: String,
  category: { type: String, required: true },
  date: { type: Date }
});

const RatingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserProfile', required: true },
  activityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  stars: { type: Number, min: 1, max: 5, required: true },
  comment: String
});

const UserProfileSchema = new mongoose.Schema({
  id: String,
  name: String,
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

const Event = mongoose.model('Event', EventSchema);
const Rating = mongoose.model('Rating', RatingSchema);
const UserProfile = mongoose.model('UserProfile', UserProfileSchema);

// --------------- EXPRESS -----------------
// Initialize Express 
const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

// API: GET /map/events with filter for category and date 
app.get('/map/events', async (req, res) => {
  try {
    const { category, date } = req.query; // Extract query parameters 
    // example: /map/events?category=music&date=2023-10-01
    const filter = {}; // used to build the filter object
    // example: { category: 'music', date: { $gte: new Date('2023-10-01'), $lt: new Date('2023-10-02') } }

    if (category) { // if category is provided, add it to the filter
      filter.category = category;
    }

    if (date) { // date >= start AND date < end
      const start = new Date(date); // set start date to the provided date
      const end = new Date(date);
      end.setDate(end.getDate() + 1); // set end date to the next day
      filter.date = { $gte: start, $lt: end }; // filter by date range (mongodb query)
    }

    const events = await Event.find(filter); // Find events matching the filter
    res.status(200).json(events); // Send the events as a JSON response
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore nel recupero eventi' });
  }
});

// API: POST /map/events to create a new event
app.post('/map/events', async (req, res) => {
  try {
    const {
      title,
      organizer,
      description_short,
      description_long,
      location,
      date,
      category
    } = req.body;

    const newEvent = new Event({
      title,
      organizer,
      description_short,
      description_long,
      location,
      date: new Date(date),
      category
    });

    await newEvent.save();
    res.status(201).json({ message: 'Evento creato con successo', event: newEvent

     });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore durante la creazione dell\'event' });
  }
});

// API: GET /map/events/:id to get event details
app.get('/map/events/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ error: 'Evento non trovato' });
    }

    res.status(200).json(event);
  } catch (err) {
    console.error(err);

    // Check if the error is a CastError (invalid ObjectId), 
    // which indicates that the provided ID is not valid
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'ID event non valido' });
    }

    res.status(500).json({ error: 'Errore durante il recupero dell\'event' });
  }
});


// Start the server 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});