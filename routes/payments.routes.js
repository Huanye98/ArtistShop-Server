const express = require("express");
const router = express.Router();
const { tokenValidation } = require("../middlewares/auth.middlewares");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Payment = require("../models/payment.model");

//post Payment
router.post("/create-payment-intent", async (req, res, next) => {
  const { amount, products, user } = req.body;
  console.log(req.body);

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "eur",
      automatic_payment_methods: {
        enabled: true,
      },
    });
    const payment = await Payment.create({
      price: amount,
      product: products,
      status: "incomplete",
      user: user,
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
    });
    const populatedPayment = await Payment.findById(payment._id)
      .populate("product")
      .exec();

    res.send({
      clientSecret: paymentIntent.client_secret,
      payment: populatedPayment,
    });
  } catch (error) {
    next(error);
  }
});
//modify data and send to our database
router.patch("/update-payment-intent", async (req, res, next) => {
  const { clientSecret, paymentIntentId } = req.body;
  try {
    await Payment.findOneAndUpdate(
      {
        clientSecret: clientSecret,
        paymentIntentId: paymentIntentId,
      },
      {
        status: "succeeded",
      }
    );
    res.status(200).json();
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const payments = await Payment.find({}).populate("product");
    if (!payments) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.json(payments);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
