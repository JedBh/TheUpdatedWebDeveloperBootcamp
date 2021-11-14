const express = require("express");
const app = express();
const session = require("express-session");

const sessionOptions = {
  secret: "thisisnotagoodsecret",
  resave: false,
  saveUninitialized: false,
};
app.use(session(sessionOptions));

app.get("/viewcount", (req, res) => {
  req.session.count ? (req.session.count += 1) : (req.session.count = 1);
  res.send(`You have viewed this page ${req.session.count} times`);
});

app.get("/register", (req, res) => {
  const { username = "anonymous" } = req.query;
  req.session.username = username;
  res.redirect("/greet");
});

app.get("/greet", (req, res) => {
  const { username } = req.session;
  res.send(`Hello ${username}`);
});

app.listen(3000, () => {
  console.log("Serving on port 3000");
});
