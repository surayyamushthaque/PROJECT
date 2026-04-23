import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      unique: true,
      sparse: true,
      default: null,
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true, 
    },

    password: {
      type: String,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },
    profileImage:{
      type:String,
      default:"",
    },
    isEmailVerified:{
      type:Boolean,
      default:false,
    },
    cart: [
      {
        type: Schema.Types.ObjectId,
        ref: "Cart",
      },
    ],

    wallet: {
      type: Number,
      default: 0,
    },

    wishlist: [
      {
        type: Schema.Types.ObjectId,
        ref: "Wishlist",
      },
    ],

    orderHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Order",
      },
    ],

    referralCode: {
      type: String,
      unique: true,
      default: () => uuidv4().slice(0, 8),
    },

    referredBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    redeemed: {
      type: Boolean,
      default: false,
    },

    redeemedUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    searchHistory: [
      {
        category: {
          type: Schema.Types.ObjectId,
          ref: "Category",
        },
        brand: {
          type: String,
        },
        searchOn: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    resetToken: {
      type: String,
    },

    resetTokenExpiry: {
      type: Date,
    },

    addresses: [
      {
        name: { type: String, required: true, trim: true },
        phone: { type: String, required: true, trim: true },
        street: { type: String, required: true, trim: true },
        city: { type: String, required: true, trim: true },
        state: { type: String, required: true, trim: true },
        pincode: { type: String, required: true, trim: true },
        country: { type: String, required: true, trim: true },
        landmark: { type: String, default: "", trim: true },
      },
    ],
  },
  {
    timestamps: true, 
  }
);

export default mongoose.model("user", userSchema);