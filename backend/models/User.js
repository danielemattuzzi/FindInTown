const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserProfileSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: String, // classic authenticaion 
  googleId: String, // google authentication 
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: { type: Date, default: Date.now }
});

// hashing password before saving
UserProfileSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // if password is not modified

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


module.exports = mongoose.model('UserProfile', UserProfileSchema);