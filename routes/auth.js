const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/handle", async (req, res) => {
  try {
    let { handle } = req.body;

    if (!handle) {
      return res.status(400).json({ error: "Handle is required" });
    }

    handle = handle.toLowerCase().trim();

    const regex = /^[a-zA-Z0-9_]{3,20}@trust$/;
    if (!regex.test(handle)) {
      return res.status(400).json({ error: "Invalid Trust Wallet handle" });
    }

    const user = await User.findOne({ handle });

    if (!user) {
      await User.create({ handle });
      return res.json({ status: "registered" });
    }

    return res.json({ status: "logged_in" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
