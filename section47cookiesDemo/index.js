const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

app.use(cookieParser());

app.get("/greet", (req, res) => {
  const { name = "Anonymous" } = req.cookies;
  res.send(`Hey there, ${name}`);
});

app.get("/setname", (req, res) => {
  res.cookie("name", "henry");
  res.cookie("animal", "harlequin shrimp");
  res.send("OK SENT YOU A COOKIE!");
});

app.listen(3000, () => {
  console.log("serving");
});
