const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");

const User = require("./models/user");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

// connecting to mongodb

// main()
//   .then(() => {
//     console.log("Mongo Connected");
//   })
//   .catch((err) => console.log("Mongo Connection Error", err));

// async function main() {
//   await mongoose.connect("mongodb://localhost:27017/");
// }

// routes
app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/secret", (req, res) => {
  res.send("This will only show if your'e logged in");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serving on port ${PORT}`);
});
