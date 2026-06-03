import Product from "../../models/productSchema.js";
import sharp from "sharp";
import fs from "fs";
import path from "path";
import Category from "../../models/category.js";


export const getaddproduct =async(req,res)=>{
   
    try{
         const categories = await Category.find();

       res.render("admin/addProduct",{categories})
    }catch(error){

        console.log(error);

        return res.status(500).send("Server Error");

    }
   
}

export const addProduct = async (req, res) => {
     

    try {
       if (!req.files || req.files.length === 0) {
            return res.status(400).send("No images uploaded");
        }
        const {
            productName,
            description,
            salePrice,
            regularPrice,
            offerPrice,
            category,
            quantity,
            brand,
            color
        } = req.body;
        

       
        // RESIZE IMAGES

        const imagePaths = req.files.map(file=>file.path); 
        const newProduct = new Product({

            productName,
            description,
            salePrice: Number(salePrice),
            regularPrice: Number(regularPrice),
            offerPrice: Number(offerPrice),
            category,
            quantity: Number(quantity),
            brand,
            color,
            productImage: imagePaths

        });

        await newProduct.save();

        return res.redirect("/admin/productmanager");

    }   catch (error) {
    
    return res.status(500).send(error.message);
}
};

export const geteditProduct = async (req, res) => {
    console.log("is this working")
    try {
        const product = await Product.findById(req.params.id).populate("category");
        const categories = await Category.find();

        if (!product) {
            return res.status(404).send("Product not found");
        }

        res.render("admin/editProduct", { product, categories });

    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};

export const editProduct = async (req, res) => {
     

    try {
       if (!req.files || req.files.length === 0) {
            return res.status(400).send("No images uploaded");
        }
        const {
            productName,
            description,
            salePrice,
            regularPrice,
            offerPrice,
            category,
            quantity,
            brand,
            color
        } = req.body;
        

       
        // RESIZE IMAGES

        const imagePaths = req.files.map(file=>file.path); 
        const newProduct = new Product({

            productName,
            description,
            salePrice: Number(salePrice),
            regularPrice: Number(regularPrice),
            offerPrice: Number(offerPrice),
            category,
            quantity: Number(quantity),
            brand,
            color,
            productImage: imagePaths

        });

        await newProduct.save();

        return res.redirect("/admin/productmanager");

    }   catch (error) {
    
    return res.status(500).send(error.message);
}
};

async function deleteProduct(id) {
    const result = await Swal.fire({
        title: "Are you sure?",
        text: "Product will be deleted!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Delete"
    });

    if (!result.isConfirmed) return;

    const response = await fetch(`/admin/deleteproduct/${id}`, {
        method: "DELETE"
    });

    const data = await response.json();

    if (data.success) {
        Swal.fire("Deleted!", "Product deleted successfully", "success");
        loadProducts(); // reload table
    }
}

export const getProducts = async (req, res) => {

    try {
        const search = req.query.search||""
        const products = await Product.find({
            isDeleted: false,
            productName:{
                $regex:search,
                $options:"i"
            }
        }).populate("category")
        .sort({ createdAt: -1 });


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
    addProduct,
     getaddproduct,
     geteditProduct,
     editProduct
}