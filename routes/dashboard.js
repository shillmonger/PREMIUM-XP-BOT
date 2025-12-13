const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/", async (req, res) => {
  try {
    // Get the first user from the database
    const user = await User.findOne().sort({ createdAt: -1 });
    
    // If no user found, redirect to home or show an appropriate message
    if (!user) {
      return res.redirect("/");
    }

    // Pass the user object to the view
    return res.render("dashboard", { user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).render("error", { message: "Error loading dashboard" });
  }
});

module.exports = router;
