const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: [true, "name is required."] },
  price: { type: Number, required: [true, "price is required."], min: 0 },
  description: { type: String },
  isAvailable: { type: Boolean, default: true },
  discountValue: { type: Number, default: 100, min:0 },
  img: { type: String },
  category: {
    type: [String],
    enum: ["Print", "Apparel", "Home Goods"],
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
