const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
  event_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'UserProfile', required: true },
  stars: { type: Number, min: 1, max: 5, required: true },
  comment: String
}); 

module.exports = mongoose.model('Rating', RatingSchema);