import mongoose from "mongoose";

const otpTokenSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: true },
  },
  { timestamps: true }
);

export default mongoose.model("OtpToken", otpTokenSchema);