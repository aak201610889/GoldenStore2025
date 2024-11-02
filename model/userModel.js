const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      unique: true,
    },
    role: {
      type: Number,
      default: 0,
    },
    cart: {
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);