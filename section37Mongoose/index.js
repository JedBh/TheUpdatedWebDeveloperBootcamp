const mongoose = require("mongoose");

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/shop");
}

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 20,
  },
  price: {
    type: Number,
    min: 0,
  },
  onSale: {
    type: Boolean,
    default: false,
  },
  catagories: {
    type: [String],
  },
  qty: {
    online: {
      type: Number,
      default: 0,
      min: [0, "Quantity must be over than 0"],
    },
    inStore: {
      type: Number,
      default: 0,
      min: [0, "Quantity must be over than 0"],
    },
  },
  size: {
    type: String,
    enum: ["S", "M", "L"],
  },
});

productSchema.methods.toggleOnSale = function () {
  this.onSale = !this.onSale;
  return this.save();
};

productSchema.methods.greet = function () {
  console.log("Hello! Hi! Howdy!");
  console.log("- from ", this.name);
};

productSchema.methods.addCatagory = function (newCat) {
  this.catagories.push(newCat);
  return this.save;
};

productSchema.statics.fireSale = function () {
  return this.updateMany({}, { onSale: true, price: 0 });
};

const Product = mongoose.model("Product", productSchema);

// const bike = new Product({
//   name: "Mountain Bike",
//   price: 599,
//   catagories: ["bike", "offroad"],
//   qty: { online: 9 },
// })
//   .save()
//   .then((data) => {
//     console.log("It Worked!");
//     console.log(data);
//   })
//   .catch((err) => {
//     console.log("It failed!", err);
//   });

const findProduct = async () => {
  const foundProduct = await Product.findOne({ name: "Mountain Bike" });
  console.log(foundProduct);
  await foundProduct.toggleOnSale();
  console.log(foundProduct);
  await foundProduct.addCatagory("Extreme");
  console.log(foundProduct);
};

Product.fireSale().then((res) => console.log(res));

// findProduct();
