const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const User = require("../models/User.model")

const router = require("express").Router()

const {tokenValidation} = require("../middlewares/auth.middlewares")


//signUp
router.post("/signup",async (req,res,next)=>{
    console.log(req.body)
    const {email,username,password} = req.body

    if (!email || !password){
        res.status(400).json({errorMessage: "Email and password are obligatory"})
        return
    }
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm
    if(passwordRegex.test(password)=== false){
        res.status(400).json({errorMessage:"The password must be 8 characters minimun,have an upper and lowercase, and a special character"})
        return
    }
    try {
        const foundUser = await User.findOne({email: email})
        if(foundUser !== null){
            res.status(400).json({errorMessage: "This email already has an account"})
            return
        }
        const salt = await bcrypt.genSalt(12)
        const hashPassword = await bcrypt.hash(password, salt)

        await User.create({
            email,
            username,
            password: hashPassword
        })

        res.sendStatus(201)
    } catch (error)        {
        next(error)
    }
})

//login

router.post("/login",async (req,res,next)=>{
    const {email, password} = req.body

    if(!email || !password){
        res.status(400).json({errorMessage:"Email and Password are required"})
        return
    }

    try {
        const foundUser = await User.findOne({email:email})
        if(foundUser === null){
            res.status(400).json({errorMessage:"No account has been made with this email"})
            return
        }

        const isPasswordCorrect = await bcrypt.compare(password,foundUser.password)
        if(isPasswordCorrect === false){
            res.status(400).json({errorMessage:"The password is not correct"})
            return
        }

        const payload = {
            _id: foundUser._id,
            email: foundUser.email,
            role: foundUser.role
        }

        const authToken = jwt.sign(
            payload,
            process.env.TOKEN_SECRET,
            {algorithm: "HS256", expiresIn: "7d" }
        )

        res.status(200).json({authToken})
        
    } catch (error) {
        next(error)
    }

})

//Verify
router.get("/verify",tokenValidation,(req,res,next)=>{
    console.log(req.payload)
    res.status(200).json(req.payload)
})

module.exports = router