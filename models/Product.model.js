const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    name: { type: String, required: [true, "name is required."] },
    price: { type: Number, required: [true, "price is required."], min: 0 },
    description: { type: String },
    isAvailable: { type: Boolean, default: true },
    isOnSale: { type: Boolean, default: false },
    img: { type: String },
  });
  

  const Product = mongoose.model("Product",productSchema)

  module.exports = Product
  