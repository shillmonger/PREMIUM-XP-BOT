require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const app = express();
const PORT = process.env.PORT || 3000;



// Session configuration
const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'your-secret-key', // Change this to a secure secret in production
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session(sessionConfig));

// Initialize Passport and session
app.use(passport.initialize());
app.use(passport.session());

// Simple user serialization (you might want to customize this)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Add user to locals for all views
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

app.set("view engine", "ejs");



// MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected (Atlas)"))
  .catch((err) => console.error("MongoDB error:", err));

// Import User model after mongoose connection is established
const User = require('./models/User');



//  Routes
app.use("/", require("./routes/index"));
app.use("/dashboard", require("./routes/dashboard"));
app.use("/auth", require("./routes/auth"));



//  Start ServerRoute 
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});