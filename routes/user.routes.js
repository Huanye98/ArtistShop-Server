const router = require("express").Router()
const {tokenValidation, adminValidation} = require("../middlewares/auth.middlewares")
const User = require("../models/User.model")

//own profile
router.get("/own",tokenValidation,async(req,res,next)=>{

    console.log("req.payload")
    try {
       const response = await User.findById(req.payload._id)
       res.json(response) 
    } catch (error) {
        next(error)
    }
})

router.get("/admin", tokenValidation, adminValidation,(req,res,next)=>{
    console.log("This route is only accessible for logged users and Admin")
})

module.exports = router