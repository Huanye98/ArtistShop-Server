const express = require("express")
const router = express.Router()
const {tokenValidation} = require("../middlewares/auth.middlewares")
const Product = require("../models/Product.model")
//get all products
router.get("/",async (req,res,next)=>{

    try {
        const response = await Product.find({})
        res.status(200).json(response)
    } catch (error) {
        next(error)
    }

})
//post product
router.post("/",async (req,res,next)=>{

    console.log(req.body)
    try {
        const {name,price,img,description,category,isAvailable,discountValue} = req.body
        const newProduct = await Product.create({
            name,
            price,
            description,
            isAvailable,
            discountValue,
            img,
            category
        })
        res.sendStatus(201).json(newProduct)
    } catch (error) {
        next(error)
    }

})
//get specific product
router.get("/:productId",async (req,res,next)=>{
    try {
        const product = await Product.findById(req.params.productId)
        if(!product){
            return res.status(404)({message:"Product not found"})
        }
        res.status(200).json(product)
    } catch (error) {
        next(error)
    }

})

//modify product
router.patch("/:productId",async (req,res,next)=>{

    try {
        const {name,price,img,description,category, isAvailable, discountValue} = req.body
        const updatedProduct = await Product.findByIdAndUpdate(req.params.productId,{
            name,
            price,
            description,
            isAvailable,
            discountValue,
            img,
            category
        },{new:true})
        if (!updatedProduct){
            return res.status(404).json({message: "Product not found"})
        }
        res.sendStatus(200).json(updatedProduct)
    } catch (error) {
        next(error)
    }

})
//delete product

router.delete("/:productId",async (req,res,next)=>{

    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.productId)
        if(!deletedProduct){
            return res.status(404).json({message: "Product not found"})
        }
        res.sendStatus(202).json({message: "Product deleted"})
    } catch (error) {
        next(error)
    }

})

module.exports = router