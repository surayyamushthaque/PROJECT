import User from "../models/user.js";
import bcrypt from "bcryptjs";
import otpStore from "../config/otpStore.js"
import {generateOTP} from "../utils/otp.js"

export const landingPage =  (req,res)=>{
    res.render("user/landing",{user:null})
}


export const loadSignup = (req,res)=>{
    res.render("user/signup",{user:null})
}

export const sendSignupOTP = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // ✅ check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: "Email already exists"
      });
    }

    // ✅ generate OTP
    const otp = generateOTP();

    // ✅ store TEMP (NO DB SAVE HERE)
    otpStore.set(email, {
      otp,
      userData: { name, email, phone, password },
      expires: Date.now() + 2 * 60 * 1000
    });

    console.log("OTP:", otp); // for testing

    res.json({
      success: true,
      message: "OTP sent"
    });

  } catch (err) {
  console.log("REAL ERROR:", err.response?.data);
  alert(err.response?.data?.error || "Signup failed");
}
};

export const loadVerifyOtp = (req, res) => {
  res.render("user/verify-Otp",{user:null});
};

export const verifySignupOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = otpStore.get(email);

    if (!record) {
      return res.status(400).json({ error: "OTP expired" });
    }

    if (record.expires < Date.now()) {
      otpStore.delete(email);
      return res.status(400).json({ error: "OTP expired" });
    }

    if (record.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // ✅ NOW USE YOUR OLD LOGIC HERE
    const { name, phone, password } = record.userData;

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      phone,
      name,
      password: hashed
    });

    await user.save();

    otpStore.delete(email);

    res.json({
      success: true,
      message: "User created",
      userId: user._id
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};






  export const loadLanding=(req,res)=>{
    res.render("user/login",{user:null})
  }

   export const postLogin=async (req,res)=>{
    try{
      const{email,password}=req.body
      const user=await User.findOne({email})
      if(!user){
        return res.status(400).json({
          success:false,
          error:"user not found"
        })
      }
      const isMatch= await bcrypt.compare(password,user.password)
        if(!isMatch){
          return res.status(400).json({succes:false,
            error:"Invalid Password"
          })
        }
        res.json({success:true,
          message:"Login Successful",
          userId:user._id
        })
        
       }catch(err){
        res.status(500).json({success:false,
          error:err.message
        })

       }
   }


  export const loadHome=(req,res)=>{
    res.render("user/home",{user:null})
  }
   
  export const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/user/login");
  });
};




export default {
    landingPage,
    loadSignup,
    sendSignupOTP,
    loadLanding,
    postLogin,
    loadHome,
    logout,
    loadVerifyOtp,
    verifySignupOTP
    

    
    
}
