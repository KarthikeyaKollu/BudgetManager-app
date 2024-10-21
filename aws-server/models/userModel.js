const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true },
  email: { type: String, required: true },
  username: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  photo: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
