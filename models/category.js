import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    offer: {
      type: String,
      default: null
    },
    visibility: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true   // ✅ correct place
  }
);

const category = mongoose.model("category", categorySchema);
export default category;