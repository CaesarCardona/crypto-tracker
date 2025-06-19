
const mongoose = require("mongoose");

const coinSchema = new mongoose.Schema({
  coinId: String,
  amount: Number,
  buyPrice: Number,
  addedAt: {
    type: Date,
    default: Date.now,
  }
});

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  passwordHash: String,
  coins: [coinSchema]
});

module.exports = mongoose.model("User", userSchema);
