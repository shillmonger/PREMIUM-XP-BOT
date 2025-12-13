const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { isAuthenticated } = require('../middleware/auth');

router.get("/", async (req, res) => {
  try {
    const user = await User.findOne().sort({ createdAt: -1 });

    if (!user) {
      return res.redirect("/");
    }

    const cashouts = [
      { handle: "stormben@trust", amount: 2500.75, time: "12:50 PM" },
      { handle: "greenkay@trust", amount: 12500.00, time: "12:50 PM" },
      { handle: "gemvex@trust", amount: 50000.00, time: "12:50 PM" },
      { handle: "thunderhex@trust", amount: 25000.00, time: "12:50 PM" },
      { handle: "trustsam@trust", amount: 10500.00, time: "12:50 PM" },
      { handle: "orangemay@trust", amount: 3500.50, time: "12:50 PM" },
      { handle: "rubypex@trust", amount: 6000.25, time: "12:49 PM" },
      { handle: "greenmax@trust", amount: 50000.00, time: "12:49 PM" },
      { handle: "popmon@trust", amount: 80000.00, time: "12:49 PM" },
      { handle: "Venom@trust", amount: 95010.00, time: "12:49 PM" }
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

// Route to handle XP claim
router.post('/claim-xp', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id;
    const xpToAdd = 1000;
    
    // Update user's XP and USD balance
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        $inc: { 
          xpBalance: xpToAdd,
          usdBalance: xpToAdd * 0.01 // Assuming 1 XP = $0.01
        } 
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ 
      success: true, 
      xpBalance: updatedUser.xpBalance,
      usdBalance: updatedUser.usdBalance
    });
  } catch (error) {
    console.error('Error claiming XP:', error);
    res.status(500).json({ success: false, message: 'Error claiming XP' });
  }
});

module.exports = router;
