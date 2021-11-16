const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const bcrypt = require("bcrypt");

const User = require("./models/user");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

// connecting to mongodb

main()
  .then(() => {
    console.log("Mongo Connected");
  })
  .catch((err) => console.log("Mongo Connection Error", err));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/authDemo");
}

// routes
app.get("/", (req, res) => {
  res.send("This is the homepage");
});
app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  //   await user.save();
  //   res.redirect("/secret");
  const hash = await bcrypt.hash(password, 12);
  const user = new User({ username, password: hash });
  await user.save();
  res.redirect("/");
});

app.get("/secret", (req, res) => {
  res.send("This will only show if your'e logged in");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serving on port ${PORT}`);
});
