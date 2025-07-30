// backend/models/User.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  "Full Name":                { type: String, required: true },
  "Email":                    { type: String, required: true },
  email:                      { type: String, required: true, unique: true },
  role:                       { type: String, enum: ['intern','employee','admin'], default: 'intern' },

  "Annual Leave Entitlement": { type: Number, default: 0 },
  "Annual Leave Balance":     { type: Number, default: 0 },
  "Leave Taken":              { type: Number, default: 0 },

  "Medical Leave Entitlement":{ type: Number, default: 0 },
  "Medical Leave Balance":    { type: Number, default: 0 },
  "Medical Leave Taken":      { type: Number, default: 0 },

  "Other Leave Entitlement":  { type: Number, default: 0 },
  "Other Leave Balance":      { type: Number, default: 0 },
  "Other Leave Taken":        { type: Number, default: 0 }
}, {
  collection: 'users',
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
