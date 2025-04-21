const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'UserProfile', required: true },
  description_short: { type: String, required: true },
  description_long: String,
  location: { type: String, required: true },
  category: { type: String, required: true },
  date: { type: Date, default: Date.now , required: true },
}); 

module.exports = mongoose.model('Event', EventSchema);