const mongoose = require("mongoose")

const paymentSchema = new mongoose.Schema({
    price: Number, 
    paymentIntentId: String, 
    clientSecret: String, 
    status: {
      type: String,
      enum: ["incomplete", "succeeded"],
      default: "incomplete",
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Product ID is required."],
        },
        quantity: { type: Number, required: [true, "Quantity is required."], min: 0 },
      },
    ],
    // user: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User"
    // },
  });

  const Payment = mongoose.model("Payment",paymentSchema)

  module.exports = Payment
  