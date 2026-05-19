import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
{
    productName: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },

    price: {
        type: Number,
        required: true,
    },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },

    quantity: {
        type: Number,
        required: true,
    },

    productImage: {
        type: [String],
        required: true,
    },
    offer:{
        type:Number,
        default:0

    },
    brand:{
        type:String,
        required:true
    },

    isBlocked: {
        type: Boolean,
        default: false,
    },

    isDeleted: {
        type: Boolean,
        default: false,
    },
},
{ timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;