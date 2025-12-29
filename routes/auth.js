const express = require("express");
const router = express.Router();
const connectDB = require("../config/db");
const User = require("../models/User");
const crypto = require('crypto');

// Helper function to generate a random referral code
const generateReferralCode = () => {
  return crypto.randomBytes(3).toString('hex').toUpperCase();
};

// Handle-based login/register
router.post("/handle", async (req, res) => {
  try {
    await connectDB();

    let { handle, referralCode } = req.body;

    if (!handle) {
      return res.status(400).json({ error: "Handle is required" });
    }

    handle = handle.toLowerCase().trim();

    // Enforce @trust
    if (!handle.endsWith("@trust")) {
      return res.status(400).json({
        error: "Handle must end with @trust"
      });
    }

    let user = await User.findOne({ handle });
    let status;

    if (!user) {
      // Register
      const newUserData = { 
        handle,
        xpBalance: 200,  // Add 50 XP for new registration
        usdBalance: 100   // Add $25 USD equivalent
      };
      
      // Generate a unique referral code
      let referralCodeUnique = false;
      let userReferralCode;
      while (!referralCodeUnique) {
        userReferralCode = generateReferralCode();
        const existingCode = await User.findOne({ referralCode: userReferralCode });
        if (!existingCode) referralCodeUnique = true;
      }
      newUserData.referralCode = userReferralCode;

      // Handle referral if code is provided
      if (referralCode) {
        const referrer = await User.findOne({ referralCode: referralCode.toUpperCase() });
        if (referrer) {
          newUserData.referredBy = referrer._id;
          // Award XP and USD to referrer (200 XP = $10 based on 20 XP/$10 rate)
          referrer.xpBalance += 200;
          // Convert XP to USD: 200 XP / 20 XP per $10 = $10
          referrer.usdBalance = (parseFloat(referrer.usdBalance || 0) + 100).toFixed(2);
          referrer.referralCount += 1;
          await referrer.save();
        }
      }

      user = await User.create(newUserData);
      status = "registered";
    } else {
      status = "logged_in";
    }

    // Log user into session
    req.login(user, (err) => {
      if (err) {
        console.error("Login error:", err);
        return res.status(500).json({ error: "Login failed" });
      }

      // ✅ Explicitly send redirect path
      return res.json({
        success: true,
        status,
        redirect: "/dashboard", // tell front-end to redirect
        user: {
          id: user._id,
          handle: user.handle,
xpBalance: user.xpBalance,
          usdBalance: user.usdBalance,
          referralCode: user.referralCode,
          referralCount: user.referralCount
        }
      });
    });

  } catch (err) {
    console.error("Auth handle error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
