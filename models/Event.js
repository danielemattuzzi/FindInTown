const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'UserProfile', required: true },
  description_short: String,
  description_long: String,
  location: String,
  category: { type: String, required: true },
  date: { type: Date }
}); 

module.exports = mongoose.model('Event', EventSchema);