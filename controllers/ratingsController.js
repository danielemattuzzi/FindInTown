const Rating = require('../models/Rating');

// API: GET /explore/rating:eventId to create a new rating
exports.createRating = async (req, res) => {
  try {
    const { eventId } = req.params;

    // check if eventId is provided
    if (!eventId) {
      return res.status(400).json({ error: 'eventId è obbligatorio nel percorso' });
    }

    // get all ratings for the event
    const ratings = await Rating.find({ event_id: eventId })
      .populate('user_id', 'name') // Popola solo il nome dell'utente
      .populate('event_id', 'title'); // Popola solo il titolo dell'evento

    res.status(200).json(ratings);
  } catch (error) {
    console.error('Errore durante il recupero delle valutazioni:', error);
    res.status(500).json({ error: 'Errore del server' });
  }
}; 

// API: POST /explore/rating to create a new rating
exports.createNewRating = async (req, res) => {
  try {
    const { event_id, user_id, stars, comment } = req.body;

    // check if all required fields are present
    if (!event_id || !user_id || !stars) {
      return res.status(400).json({ error: 'event_id, user_id e stars sono obbligatori' });
    }

    // create a new rating
    const newRating = new Rating({
      event_id,
      user_id,
      stars,
      comment
    });

    const savedRating = await newRating.save();

    res.status(201).json(savedRating);
  } catch (err) {
    console.error('Errore durante il salvataggio della valutazione:', err);
    res.status(500).json({ error: 'Errore del server' });
  }
}; 

// API: DELETE /explore/rating/:ratingId to delete a rating
exports.deleteRating = async (req, res) => {
  try {
    const { ratingId } = req.params;

    // check if ratingId is provided
    if (!ratingId) {
      return res.status(400).json({ error: 'ratingId è obbligatorio nel percorso' });
    }

    // delete the rating
    const deletedRating = await Rating.findByIdAndDelete(ratingId);

    if (!deletedRating) {
      return res.status(404).json({ error: 'Valutazione non trovata' });
    }

    res.status(200).json({ message: 'Valutazione eliminata con successo' });
  } catch (err) {
    console.error('Errore durante l\'eliminazione della valutazione:', err);
    res.status(500).json({ error: 'Errore del server' });
  }
};