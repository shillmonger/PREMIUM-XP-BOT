const express = require("express");
const app = express();

const PORT = 3000;

// set EJS as view engine
app.set("view engine", "ejs");

// route for home page
app.get("/", (req, res) => {
  res.render("index");
});

// start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
