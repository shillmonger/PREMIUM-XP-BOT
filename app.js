require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo").default || require("connect-mongo");
const passport = require("passport");

const app = express();
const PORT = process.env.PORT || 3000;

// ===== TRUST PROXY =====
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1); // trust first proxy (needed for secure cookies)
}

// ===== MONGODB CONNECTION =====
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected (Atlas)"))
  .catch((err) => console.error("MongoDB error:", err));

// ===== IMPORT USER MODEL =====
const User = require("./models/User");

// ===== SESSION CONFIGURATION =====
const sessionStore = MongoStore.create({
  mongoUrl: process.env.MONGODB_URI,
  collectionName: "sessions",
  ttl: 24 * 60 * 60, // 1 day
});

const sessionConfig = {
  secret: process.env.SESSION_SECRET || "your-secret-key",
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // only send over HTTPS
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
};

// ===== MIDDLEWARE =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session(sessionConfig));

// ===== PASSPORT CONFIGURATION =====
app.use(passport.initialize());
app.use(passport.session());

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

// Make `user` available in all EJS templates
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// ===== VIEW ENGINE =====
app.set("view engine", "ejs");

// ===== ROUTES =====
app.use("/", require("./routes/index"));
app.use("/dashboard", require("./routes/dashboard"));
app.use("/auth", require("./routes/auth"));

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
