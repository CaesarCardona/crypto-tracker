
const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/", async (req, res) => {
  const user = await User.findOne({ email: "demo@example.com" });
  if (!user) return res.status(404).send("User not found");
  res.json(user.coins);
});

router.post("/", async (req, res) => {
  const { coinId, amount, buyPrice } = req.body;
  const user = await User.findOne({ email: "demo@example.com" });

  user.coins.push({ coinId, amount, buyPrice });
  await user.save();

  res.status(201).send("Coin added");
});

module.exports = router;
