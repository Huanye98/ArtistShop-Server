const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

const authRouter = require("./auth.routes")
router.use("/auth",authRouter)

const userRouter = require("./user.routes")
router.use("/user",userRouter)

const productsRouter = require("./products.routes")
router.use("/products",productsRouter)

const uploadRoutes = require("./upload.routes")
router.use("/upload",uploadRoutes)

module.exports = router;
