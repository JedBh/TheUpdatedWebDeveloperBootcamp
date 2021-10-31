const express = require("express");
const app = express();
const morgan = require("morgan");

// app.use(morgan("dev"));

app.use((req, res, next) => {
  req.requestTime = Date.now();
  console.log(req.method, req.path);
  next();
});

app.use("/", (req, res, next) => {
  //   console.log("I love dogs!");
  next();
});

const verifyPassword = (req, res, next) => {
  const { password } = req.query;
  if (password === "chickennugget") {
    next();
  } else {
    throw new Error("Password required");
  }
};

app.get("/", (req, res) => {
  console.log(`REQUEST TIME: ${req.requestTime}`);
  res.send("Home page");
});

app.get("/error", (req, res) => {
  chicken.fly();
});

app.get("/dogs", (req, res) => {
  console.log(`REQUEST TIME: ${req.requestTime}`);
  res.send("WOOF WOOF!");
});

app.get("/secret", verifyPassword, (req, res) => {
  res.send("Sometimes I wear headphones so I don't have to talk to anyone!");
});

app.use((req, res) => {
  res.status(404).send("NOT FOUND!");
});

app.use((err, req, res, next) => {
  console.log(err);
  next(err);
});

app.listen(3000, () => {
  console.log("Server is listening");
});
