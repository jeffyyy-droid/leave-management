// backend/models/leaveModel.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const leaveSchema = new Schema(
  {
    leave_type: { type: String, required: true },
    start_date: { type: Date,   required: true },
    end_date:   { type: Date,   required: true },
    status:     { type: String, default: 'pending' },
    user:       { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  {
    // ← this is where you enable automatic createdAt/updatedAt
    timestamps: true
  }
);

module.exports = mongoose.model('Leave', leaveSchema);
