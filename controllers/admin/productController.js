import Product from "../../models/productSchema.js";
import sharp from "sharp";
import fs from "fs";
import path from "path";
// import streamUpload from "../utils/cloudinaryUpload.js";


export const addProduct = async (req, res) => {

    try {

        const {productName,description,price,category, offer,productImage,quantity,brand} = req.body
           const imagePaths = req.files.map(file=>file.path) 

        const newProduct = new Product({

            productName:productName,

            description: description,

            price: price,

            category: category,

            quantity: quantity,
            
            brand : brand,

            productImage: imagePaths,
        });

        await newProduct.save();

        res.redirect("/admin/products");

    } catch (error) {

        console.log(error);

        res.status(500).send("Server Error");
    }
};

export const deleteProduct = async (req, res) => {

    try {

        await Product.findByIdAndUpdate(
            req.params.id,
            {
                isDeleted: true,
            }
        );

        res.redirect("/admin/products");

    } catch (error) {

        console.log(error);
    }
};

export const getProducts = async (req, res) => {

    try {
        const search = req.query.search||""
        const products = await Product.find({
            isDeleted: false,
            productName:{
                $regex:search,
                $options:"i"
            }
        });

        res.render("admin/productmanager", {
            products,
            currentPage:"products",search

        });

    } catch (error) {

        console.log(error);
    }
};
export default {
    getProducts,
    deleteProduct,
     addProduct
}