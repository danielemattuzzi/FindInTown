const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'UserProfile', required: true },
  description_short: { type: String, required: true },
  description_long: String, 
  image: { type: String, required: true },
  location_text: { type: String, required: true },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [lng, lat]
      required: true
    }
  },
  category: { type: String, required: true },
  date: { type: Date, default: Date.now , required: true },
}); 

EventSchema.index({ location: '2dsphere' }); // Create a 2dsphere index for geospatial queries (used for location-based searches)
module.exports = mongoose.model('Event', EventSchema);