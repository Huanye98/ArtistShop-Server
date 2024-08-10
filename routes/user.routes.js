const router = require("express").Router();
const {
  tokenValidation,
  adminValidation,
} = require("../middlewares/auth.middlewares");
const User = require("../models/User.model");
const Product = require("../models/Product.model");

//own profile
router.get("/own", tokenValidation, async (req, res, next) => {
  console.log(req.payload);
  try {
    const user = await User.findById(req.payload._id).populate("cart").exec();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
});
//add to cart
router.patch("/own", tokenValidation, async (req, res, next) => {
  console.log(req.payload);
  const { item } = req.body;
  if (!item) {
    return res.status(400).json({ message: "Item is required" });
  }
  try {
    const user = await User.findByIdAndUpdate(
      req.payload._id,
      { $push: { cart: item } },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "Was not able add to cart" });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
});
//delete from cart
router.patch("/own/delete", tokenValidation, async (req, res, next) => {
  console.log(req.payload);
  const { itemId } = req.body;
  if (!itemId) {
    return res.status(400).json({ message: "Item is required" });
  }
  try {
    const user = await User.findById(req.payload._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const itemIndex = user.cart.findIndex(
      (item) => item._id.toString() === itemId
    );
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }
    user.cart.splice(itemIndex, 1);

    const updatedUser = await User.findByIdAndUpdate(
      req.payload._id,
      { cart: user.cart },
      { new: true }
    ).populate("cart");

    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
});

router.get("/admin", tokenValidation, adminValidation, (req, res, next) => {
  console.log("This route is only accessible for logged users and Admin");
});

router.post(
  "/admin/product",
  tokenValidation,
  adminValidation,
  async (req, res, next) => {
    if (!req.body) {
      return res.status(400).json({ message: "Product is required" });
    }
    try {
      const newProduct = await Product.create({ ...req.body });
      if (!newProduct) {
        return res.status(400).json({ message: "Was not able to add Product" });
      }
      res.sendStatus(201);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/admin/product/:productId",
  tokenValidation,
  adminValidation,
  async (req, res, next) => {
    try {
      const deletedProduct = await Product.findByIdAndDelete(
        req.params.productId
      );
      if (!deletedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      return res.status(200).json({ message: "Product deleted succesfully" });
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  "/admin/product/:product",
  tokenValidation,
  adminValidation,
  async (req, res, next) => {
    if (!req.body) {
      return res.status(400).json({ message: "No fields provided for update" });
    }
    console.log("body",req.body)
    console.log("params",req.params.product)
    try {
      const { product } = req.params;
      const editedProduct = await Product.findByIdAndUpdate(
        product,
        req.body,
        { new: true }
      );
      console.log("product was modified")
      if (!editedProduct) {
        return res
          .status(404)
          .json({ message: "Was not able to edit Product" });
      }
      res.sendStatus(200).json(editedProduct,{ message: "Product updated" });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
