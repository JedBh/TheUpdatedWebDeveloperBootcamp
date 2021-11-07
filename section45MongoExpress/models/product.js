const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, "cannot be blank"],
  },
  price: {
    type: Number,
    required: [true, "cannot be blank or below zero"],
    min: 0,
  },
  category: {
    type: String,
    lowercase: true,
    enum: ["fruit", "vegetable", "dairy"],
  },
  farm: {
    type: Schema.Types.ObjectId,
    ref: "farm",
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
