const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

const appError = require("./appError");
const Product = require("./models/product");
const Farm = require("./models/farm");
const { wrap } = require("module");

// connecting to mongodb
main()
  .then(() => {
    console.log("Mongo Connected");
  })
  .catch((err) => console.log("Mongo Connection Error", err));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/farmStand3");
}

// default setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// variables
const categories = ["vegetable", "fruit", "dairy"];

function wrapAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch((e) => next(e));
  };
}

// routes
// farm routes
app.get(
  "/farms",
  wrapAsync(async (req, res) => {
    const farms = await Farm.find({});
    res.render("farms/index", { farms });
  })
);

app.get("/farms/new", (req, res) => {
  res.render("farms/new");
});

app.get(
  "/farms/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const farm = await Farm.findById(id).populate("products");
    console.log(farm);
    res.render("farms/show", { farm });
  })
);

app.delete(
  "/farms/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const result = await Farm.findByIdAndDelete(id);
    res.redirect("/farms");
  })
);

app.post(
  "/farms",
  wrapAsync(async (req, res) => {
    const farm = new Farm(req.body);
    await farm.save();
    res.redirect("/farms");
  })
);

app.get(
  "/farms/:id/products/new",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const farm = await Farm.findById(id);
    res.render("products/new", { id, categories, farm });
  })
);

app.post("/farms/:id/products", async (req, res) => {
  const { id } = req.params;
  const farm = await Farm.findById(id);
  const { name, price, category } = req.body;
  const product = new Product({ name, price, category });
  farm.products.push(product);
  product.farm = farm;
  await farm.save();
  await product.save();
  res.redirect(`/farms/${id}`);
});

// products routes
app.get("/products", async (req, res, next) => {
  try {
    const { category } = req.query;
    if (category) {
      const products = await Product.find({ category: category });
      res.render("products/index", { products: products, category: category });
    } else {
      const products = await Product.find({});
      res.render("products/index", { products: products, category: "All" });
    }
  } catch (e) {
    next(e);
  }
});

// app.get("/products/new", (req, res) => {
//   res.render("products/new", { categories: categories });
// });

app.post("/products", async (req, res, next) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect("/products");
  } catch (e) {
    next(e);
  }
});

app.get(
  "/products/:id",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id).populate("farm");
    if (!product) {
      throw new appError("Product not found", 404);
    }
    res.render("products/show", { product: product });
  })
);

app.get(
  "/products/:id/edit",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      throw new appError("Product not found", 404);
    }
    res.render("products/edit", { product: product, categories: categories });
  })
);

app.put(
  "/products/:id",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, {
      runValidators: true,
      new: true,
    });
    res.redirect(`/products/${product._id}`);
  })
);

app.delete(
  "/products/:id",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.redirect("/products");
  })
);

const handleValidationError = (err) => {
  console.dir(err);
  return new appError(`Validtion Failed... ${err.message}`, 400);
};

app.use((err, req, res, next) => {
  console.log(err.name);
  if (err.name === "ValidationError") err = handleValidationError(err);
  next(err);
});

app.use((err, req, res, next) => {
  const { status = 500, message = "something went wrong" } = err;
  res.status(status).send(message);
});

// app listening
app.listen(3000, () => {
  console.log("APP IS LISTENING!");
});

// /farms/:farm_id/products/new GET
// /farms/:farm_id/products POST
