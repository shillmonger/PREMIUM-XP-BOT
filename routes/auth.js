const express = require("express");
const router = express.Router();
const connectDB = require("../config/db");
const User = require("../models/User");

// Handle-based login/register
router.post("/handle", async (req, res) => {
  try {
    await connectDB();

    let { handle } = req.body;

    if (!handle) {
      return res.status(400).json({ error: "Handle is required" });
    }

    handle = handle.toLowerCase().trim();

    // ✅ enforce @trust
    if (!handle.endsWith("@trust")) {
      return res.status(400).json({
        error: "Handle must end with @trust"
      });
    }

    let user = await User.findOne({ handle });

    let status;

    if (!user) {
      // ✅ register
      user = await User.create({ handle });
      status = "registered";
    } else {
      status = "logged_in";
    }

    // ✅ LOG USER INTO SESSION
    req.login(user, (err) => {
      if (err) {
        console.error("Login error:", err);
        return res.status(500).json({ error: "Login failed" });
      }

      return res.json({
        success: true,
        status,
        user: {
          id: user._id,
          handle: user.handle,
          xpBalance: user.xpBalance,
          usdBalance: user.usdBalance
        }
      });
    });

  } catch (err) {
    console.error("Auth handle error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
