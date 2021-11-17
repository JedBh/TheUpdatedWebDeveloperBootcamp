const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const bcrypt = require("bcrypt");
const session = require("express-session");

const User = require("./models/user");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

const sessionOptions = {
  secret: "notagoodsecret",
  resave: false,
  saveUninitialized: false,
};

app.use(session(sessionOptions));

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
  const hash = await bcrypt.hash(password, 12);
  const user = new User({ username, password: hash });
  await user.save();
  req.session.user_id = user._id;
  res.redirect("/");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  const validPassword = await bcrypt.compare(password, user.password);
  if (validPassword) {
    req.session.user_id = user._id;
    res.send("Welcome");
  } else {
    res.send("Try again");
  }
});

app.post("/logout", (req, res) => {
  req.session.user_id = null;
  res.redirect("/login");
});

app.get("/secret", (req, res) => {
  if (!req.session.user_id) res.redirect("/login");
  res.render("secret");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serving on port ${PORT}`);
});
