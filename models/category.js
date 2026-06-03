import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      status: {
        type: String,
        enum: ['listed', 'unlisted'],
        default: 'listed'
    }
    },
    image: {
      type: String,
      default: null,
    },
    offer: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    isListed: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Category', categorySchema);