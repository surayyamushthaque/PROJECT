import mongoose from "mongose"

const productSchema = new mongoose.Schema({
    name : String,
    price : Number,
    category:{
        type : Boolean,
        default : false,

    },
},{timestamps:true})