
import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: String,
    phone: String,
    addressLine: String,
    city: String,
    state: String,
    pincode: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Address", addressSchema);
