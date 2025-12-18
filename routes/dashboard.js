const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { isAuthenticated } = require('../middleware/auth');

router.get("/", isAuthenticated, (req, res) => {
  try {
    // ✅ THIS IS THE LOGGED-IN USER
    const user = req.user;

    const cashouts = [
      { handle: "stormben@trust", amount: 50500.75, time: "12:50 PM" },
      { handle: "greenkay@trust", amount: 192500.00, time: "12:50 PM" },
      { handle: "gemvex@trust", amount: 50000.00, time: "12:50 PM" },
      { handle: "thunderhex@trust", amount: 25000.00, time: "12:50 PM" },
      { handle: "trustsam@trust", amount: 10500.00, time: "12:50 PM" },
      { handle: "orangemay@trust", amount: 35000.50, time: "12:50 PM" },
      { handle: "rubypex@trust", amount: 60010.25, time: "12:49 PM" },
      { handle: "greenmax@trust", amount: 50000.00, time: "12:49 PM" },
      { handle: "popmon@trust", amount: 80000.00, time: "12:49 PM" },
      { handle: "Venom@trust", amount: 950100.00, time: "12:49 PM" }
    ];

    return res.render("dashboard", {
      user,
      cashouts
    });

  } catch (error) {
    console.error("Dashboard error:", error);
    return res.status(500).render("error", {
      message: "Error loading dashboard"
    });
  }
});





// claim-earned-xp (ALWAYS ALLOWED)
router.post("/claim-earned-xp", isAuthenticated, async (req, res) => {
  try {
    await require("../config/db")();

    const user = req.user;

    const xpToClaim = 1000; // or compute dynamically if you want

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        $inc: {
          xpBalance: xpToClaim,
          usdBalance: xpToClaim * 0.1
        }
      },
      { new: true }
    );

    return res.json({
      success: true,
      xpBalance: updatedUser.xpBalance,
      usdBalance: updatedUser.usdBalance
    });

  } catch (err) {
    console.error("EARNED XP ERROR:", err);
    res.status(500).json({ success: false, message: "Error claiming XP" });
  }
});






// claim-daily-xp (24 HOURS)
router.post("/claim-daily-xp", isAuthenticated, async (req, res) => {
  try {
    await require("../config/db")();

    const user = req.user;
    const now = new Date();

    if (user.lastXpClaim) {
      const diff = now - new Date(user.lastXpClaim);
      const hours = diff / (1000 * 60 * 60);

      if (hours < 24) {
        return res.status(400).json({
          success: false,
          message: "XP already claimed today"
        });
      }
    }

    const xpToAdd = 1000;

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        $inc: {
          xpBalance: xpToAdd,
          usdBalance: xpToAdd * 0.1
        },
        $set: {
          lastXpClaim: now
        }
      },
      { new: true }
    );

    return res.json({
      success: true,
      xpBalance: updatedUser.xpBalance,
      usdBalance: updatedUser.usdBalance
    });

  } catch (err) {
    console.error("DAILY XP ERROR:", err);
    res.status(500).json({ success: false, message: "Error claiming daily XP" });
  }
});



module.exports = router;
