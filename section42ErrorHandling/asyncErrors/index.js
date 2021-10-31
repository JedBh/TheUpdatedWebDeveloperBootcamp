const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

const appError = require("./appError");
const Product = require("./models/product");

// connecting to mongodb
main()
  .then(() => {
    console.log("Mongo Connected");
  })
  .catch((err) => console.log("Mongo Connection Error", err));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/farmStand2");
}

// default setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// variables
const categories = ["vegetable", "fruit", "dairy"];

// routes
app.get("/products", async (req, res) => {
  const { category } = req.query;
  if (category) {
    const products = await Product.find({ category: category });
    res.render("products/index", { products: products, category: category });
  } else {
    const products = await Product.find({});
    res.render("products/index", { products: products, category: "All" });
  }
});

app.get("/products/new", (req, res) => {
  throw new appError("not allowed", 401);
  res.render("products/new", { categories: categories });
});

app.post("/products", async (req, res) => {
  const newProduct = new Product(req.body);
  await newProduct.save();
  res.redirect("/products");
});

app.get("/products/:id", async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    return next(new appError("Product not found", 404));
  }
  res.render("products/show", { product: product });
});

app.get("/products/:id/edit", async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    return next(new appError("Product not found", 404));
  }
  res.render("products/edit", { product: product, categories: categories });
});

app.put("/products/:id", async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(id, req.body, {
    runValidators: true,
    new: true,
  });
  if (!product) {
    return next(new appError("Product not found", 404));
  }
  res.redirect(`/products/${product._id}`);
});

app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  const deletedProduct = await Product.findByIdAndDelete(id);
  res.redirect("/products");
});

app.use((err, req, res, next) => {
  const { status = 500, message = "something went wrong" } = err;
  res.status(status).send(message);
});

// app listening
app.listen(3000, () => {
  console.log("APP IS LISTENING!");
});
