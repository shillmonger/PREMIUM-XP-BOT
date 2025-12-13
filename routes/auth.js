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

    let user = await User.findOne({ handle });

    if (!user) {
      user = await User.create({ handle });
    }
    
    // Set up the session
    req.session.user = {
      _id: user._id,
      handle: user.handle
    };
    
    // Save the session
    await new Promise((resolve, reject) => {
      req.session.save(err => {
        if (err) reject(err);
        else resolve();
      });
    });

    return res.json({ 
      status: user ? "logged_in" : "registered",
      user: {
        _id: user._id,
        handle: user.handle
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
