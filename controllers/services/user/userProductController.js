import Product from "../../../models/productSchema.js";

export const loadshop = async (req,res)=>{
    try{
        const products = await Product.find({
            isBlocked:false,
            isDeleted:false,
            quantity:{$gt:0}
        }).populate("category")
        res.render("user/shop",{products})
    }catch(error){
        console.log(error)
        req.redirect("/")
    }
}