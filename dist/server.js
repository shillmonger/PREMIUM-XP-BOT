"use strict";
// import express from "express";
// import path from "path";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Set view engine
app.set("view engine", "ejs");
app.set("views", path_1.default.join(__dirname, "../views"));
// Serve static files (Tailwind output)
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
// Home route
app.get("/", (req, res) => {
    res.render("index"); // renders views/index.ejs
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
