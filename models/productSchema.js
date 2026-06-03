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

    salePrice: {
        type: Number,
        required: true,
    },

    regularPrice: {
        type: Number,
        default: 0,
    },

    offerPrice: {
        type: Number,
        default: 0,
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

    brand: {
        type: String,
        required: true,
    },

    color: {
        type: String,
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

export default mongoose.model("Product", productSchema);