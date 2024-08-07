const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

const authRouter = require("./auth.routes")
router.use("/user",authRouter)

const userRouter = require("./user.routes")
router.use("/user",userRouter)


module.exports = router;
