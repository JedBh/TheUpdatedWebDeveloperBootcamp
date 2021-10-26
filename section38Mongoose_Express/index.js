const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");

const Product = require("./models/product");

// connecting to mongodb
main()
  .then(() => {
    console.log("Mongo Connected");
  })
  .catch((err) => console.log("Mongo Connection Error", err));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/farmStand");
}

// default setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// routes
app.get("/products", async (req, res) => {
  const products = await Product.find({});
  res.render("products/index", { products: products });
});

app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  console.log(product);
  res.render("products/show", { product: product });
});

// app listening
app.listen(3000, () => {
  console.log("APP IS LISTENING!");
});
