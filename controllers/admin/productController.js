import { trusted } from "mongoose"
import Product from "../../models/productSchema.js"

export const addProduct = async(req,res)=>{
    try{
        const product = new Product(req,body)
        await product.save()
        res.json(product)
    }catch(err){
        res.status(500).json({error:err.message})
    }
}

export const updateProduct = async(req,res)=>{
    const product = await Product.findByIdAndUpdateProduct(
        req.params.id,req.body,{
            new:true})
             res.json(product)
}

export const deleteProduct=async(req,res)=>{
    await Product.findByIdAndUpdate(req.params.id,{
        isDeleted:true,
    })
    res.json({message:"Product deleted"})
}