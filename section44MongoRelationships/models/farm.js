const mongoose = require("mongoose");
const { Schema } = mongoose;
// connecting to mongodb
main()
  .then(() => {
    console.log("Mongo Connected");
  })
  .catch((err) => console.log("Mongo Connection Error", err));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/relationshipDemo");
}

const productSchema = Schema({
  name: String,
  price: Number,
  season: {
    type: String,
    enum: ["spring", "summer", "fall", "winter"],
  },
});

const farmSchema = Schema({
  name: String,
  city: String,
  products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
});

const Product = mongoose.model("Product", productSchema);
const Farm = mongoose.model("Farm", farmSchema);

// Product.insertMany([
//   {
//     name: "Goddes Melon",
//     price: 4.99,
//     season: "summer",
//   },
//   {
//     name: "Sugar Baby Watermelon",
//     price: 5.99,
//     season: "summer",
//   },
//   {
//     name: "Asparagus",
//     price: 3.99,
//     season: "spring",
//   },
// ]);

const makeFarm = async () => {
  const farm = new Farm({
    name: "Full Belly Farms",
    city: "Guinda, CA",
  });
  const melon = await Product.findOne({ name: "Goddes Melon" });
  farm.products.push(melon);
  await farm.save();
  console.log(farm);
};

const addProduct = async () => {
  const farm = await Farm.findOne({ name: "Full Belly Farms" });
  const watermelon = await Product.findOne({ name: "Sugar Baby Watermelon" });
  farm.products.push(watermelon);
  farm.save();
};

// makeFarm();
// addProduct();

Farm.findOne({ name: "Full Belly Farms" })
  .populate("products")
  .then((farm) => {
    console.log(farm);
  })
  .catch((e) => {
    console.log(e);
  });
