const express = require("express")
const router = express.Router()
const {tokenValidation} = require("../middlewares/auth.middlewares")
const Payment = require("../models/payment.model")
//get all Payments
router.get("/",async (req,res,next)=>{

    try {
        const response = await Payment.find({})
        res.status(200).json(response)
    } catch (error) {
        next(error)
    }

})
//post Payment
router.post("/",async (req,res,next)=>{

    console.log(req.body)
    try {
        const {price,paymentIntentId,clientSecret,status,Payment,user} = req.body
        const newPayment = await Payment.create({
            price,paymentIntentId,clientSecret,status,Payment,user
        }).populate("User")
        res.sendStatus(201).json(newPayment)
    } catch (error) {
        next(error)
    }

})
//get specific Payment
router.get("/:paymentId",async (req,res,next)=>{
    try {
        const selectedPayment = await Payment.findById(req.params.paymentId)
        if(!selectedPayment){
            return res.status(404)({message:"Payment not found"})
        }
        res.status(200).json(selectedPayment)
    } catch (error) {
        next(error)
    }

})

//modify Payment
router.patch("/:paymentId",async (req,res,next)=>{

    try {
        const {price,paymentIntentId,clientSecret,status,Payment,user} = req.body
        const updatedPayment = await Payment.findByIdAndUpdate(req.params.PaymentId,{
            price,paymentIntentId,clientSecret,status,Payment,user
        },{new:true})
        if (!updatedPayment){
            return res.status(404).json({message: "Payment not found"})
        }
        res.sendStatus(200).json(updatedPayment)
    } catch (error) {
        next(error)
    }

})
//delete Payment

router.delete("/:paymentId",async (req,res,next)=>{

    try {
        const deletedPayment = await Payment.findByIdAndDelete(req.params.paymentId)
        if(!deletedPayment){
            return res.status(404).json({message: "Payment not found"})
        }
        res.sendStatus(202).json({message: "Payment deleted"})
    } catch (error) {
        next(error)
    }

})

module.exports = router