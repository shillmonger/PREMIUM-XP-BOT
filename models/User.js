// In models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  handle: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  xpBalance: {
    type: Number,
    default: 0
  },
  usdBalance: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("User", userSchema);