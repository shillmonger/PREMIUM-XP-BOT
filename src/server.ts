// import express from "express";
// import path from "path";

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Serve the public folder
// app.use(express.static(path.join(__dirname, "../public")));

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "../public/index.html"));
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });


import express from "express";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

// Serve static files (Tailwind output)
app.use(express.static(path.join(__dirname, "../public")));

// Home route
app.get("/", (req, res) => {
  res.render("index"); // renders views/index.ejs
});

app.listen(PORT, () => {
console.log(`Server is running on http://localhost:${PORT}`);
});
