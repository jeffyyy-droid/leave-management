// backend/models/accessRole.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const accessRoleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    // An array of action strings like "REQUEST_LEAVE"
    permission: {
      type: [String],
      default: []
    }
  },
  {
    collection: 'accessRoles',
    timestamps: true  // optional: gives you createdAt/updatedAt
  }
);

module.exports = mongoose.model('AccessRole', accessRoleSchema);
