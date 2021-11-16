const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "username cannot be blank"],
  },
  password: {
    type: String,
    required: [true, "password cannot be blank"],
  },
});

module.exports = mongoose.model("User", userSchema);
