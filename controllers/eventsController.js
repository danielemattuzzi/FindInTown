const Event = require('../models/Event');

// API: GET /map/events with filter for category and date 
exports.getAllEvents = async (req, res) => {
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

    const events = await Event.find(filter) // Find events matching the filter
      .populate('organizer', 'name email') // Populate the organizer field with the user's name and email
      .sort({ date: 1 }); // Sort events by date in ascending order

    res.status(200).json(events); // Send the events as a JSON response
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore nel recupero eventi' });
  }
};

// API: POST /map/events to create a new event adding the organizer objectId
exports.createEvent = async (req, res) => {
  try {
    const newEvent = new Event({ ...req.body, organizer: req.user.id }); // create a new event with the request body and the organizer set to the logged-in user
    const savedEvent = await newEvent.save();
    savedEvent.populate('organizer', 'name email'); // populate the organizer field with the user's name and email
    res.status(201).json(savedEvent);
  } catch (err) {
    res.status(500).json({ error: 'Errore creazione evento' });
  }
};


/* 
// API: POST /map/events to create a new event (NO VERIFICATION)
exports.createEvent = async (req, res) => {
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
};
*/ 


// API: PUT /map/events/:id to update an event only if the user is the organizer
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ error: 'Evento non trovato' });
    }

    if (event.organizer.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Non sei il proprietario dell’evento' });
    }

    const updated = await Event.findByIdAndUpdate(req.params.eventId, req.body, { new: true });
    res.json(updated);

  } catch (error) {
    console.error('Errore nell’aggiornamento evento:', error);
    res.status(500).json({ error: 'Errore del server durante l’aggiornamento dell’evento' });
  }
};



// API: GET /map/events/:id to get event details
exports.getEventDetails = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId)
      .populate('organizer', 'name email') // Populate the organizer field with the user's name and email

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
};

// API: DELETE /map/events/:id to delete an event only if the user is the organizer
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ error: 'Evento non trovato' });
    }

    if (event.organizer.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Non autorizzato' });
    }

    await event.deleteOne();
    res.json({ message: 'Evento eliminato' });

  } catch (error) {
    console.error('Errore durante l’eliminazione dell’evento:', error);
    res.status(500).json({ error: 'Errore del server durante l’eliminazione' });
  }
};


/* 
// API: DELETE /map/events/:id to delete an event (NO VERIFICATION)
exports.deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const deletedEvent = await Event.findByIdAndDelete(eventId);

    if (!deletedEvent) {
      return res.status(404).json({ error: 'Evento non trovato' });
    }

    res.status(200).json({ message: 'Evento eliminato con successo' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore durante l\'eliminazione dell\'event' });
  }
};
*/ 