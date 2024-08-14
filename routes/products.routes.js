const express = require("express")
const router = express.Router()
const {tokenValidation} = require("../middlewares/auth.middlewares")
const Product = require("../models/Product.model")

router.get("/all",async(req,res,next)=>{
    try {
        const products = await Product.find({},"name")
        res.status(200).json(products)
    } catch (error) {
        next(error)
    }
})
router.get("/all/images",async(req,res,next)=>{
    try {
        const products = await Product.find({category:["Print"]},"name imageUrl")
        res.status(200).json(products)
    } catch (error) {
        next(error)
    }
})


//get 20 products
router.get("/",async (req,res,next)=>{

    try {
        //paginación
        // página que se carga, cantidad de rpoductos por página, cantidad de productos que saltarse.
        // saltarse los productos skip y get la cantidad
        // contar cuántos productos hay para poder poner el máximo de páginas
        // enviar todo en un paquete + la cantidad máxima de páginas
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 18
        const skip = (page-1)*limit
        //query
        const category = req.query.category? {category : req.query.category} : {}

        const products = await Product.find(category).skip(skip).limit(limit)
        const allProductsNum = await Product.countDocuments(category)
        res.status(200).json({
            page,
            limit,
            allProductsNum,
            totalPages: Math.ceil(allProductsNum/limit),
            products
        })
    } catch (error) {
        next(error)
    }

})
//post product
router.post("/",async (req,res,next)=>{
    try {
        const {name,price,imageUrl,description,category,isAvailable,discountValue} = req.body
        const newProduct = await Product.create({
            name,
            price,
            description,
            isAvailable,
            discountValue,
            imageUrl,
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
        const {name,price,imageUrl,description,category, isAvailable, discountValue} = req.body
        const updatedProduct = await Product.findByIdAndUpdate(req.params.productId,{
            name,
            price,
            description,
            isAvailable,
            discountValue,
            imageUrl,
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