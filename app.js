require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;



//  Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");



//  MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected (Atlas)"))
  .catch((err) => console.error("MongoDB error:", err));



//  Routes
app.use("/", require("./routes/index"));
app.use("/dashboard", require("./routes/dashboard"));
app.use("/auth", require("./routes/auth"));



//  Start ServerRoute 
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
