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

    const events = await Event.find(filter); // Find events matching the filter
    res.status(200).json(events); // Send the events as a JSON response
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore nel recupero eventi' });
  }
};

// API: POST /map/events to create a new event
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

// API: GET /map/events/:id to get event details
module.exports.getEventDetails = async (req, res) => {
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
};

// API: DELETE /map/events/:id to delete an event
module.exports.deleteEvent = async (req, res) => {
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