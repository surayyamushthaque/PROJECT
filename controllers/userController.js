process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import passport from "passport";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import otpStore from "../config/otpStore.js"
import {generateOTP} from "../utils/otp.js"
import nodemailer from "nodemailer"
import transporter from "../config/mailer.js"
import axios from "axios";
import crypto from "crypto";





export const landingPage =  (req,res)=>{
    res.render("user/landing",{user:null})
}


export const loadSignup = (req,res)=>{
    res.render("user/signup",{user:null})
}

export const sendSignupOTP = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: "Email already exists"
      });
    }

    // ✅ generate OTP
    const otp = generateOTP();
       
    req.session.otpData = {
      otp,
      userData:{ name,email,phone,password},
      expires: Date.now()+2*60*1000,
      createdAt: Date.now()
    }

      

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It expires in 2 minutes.`
    });
    

    return res.json({
      success: true,
      message: "OTP sent to email"
    });

  } catch (err) {
  console.log("FULL ERROR 👉", err);
  console.log("MESSAGE 👉", err.message);
  return res.status(500).json({ error: err.message });
}
};

export const loadVerifyOtp = (req, res) => {
  res.render("user/verify-Otp",{user:null});
};

export const verifySignupOTP = async (req, res) => {
  try {
    const otp = req.body.otp.trim();

    const record = req.session.otpData;

    if (!record) {
      return res.status(400).json({ error: "Session expired. Please signup again." });
    }

    if (record.expires < Date.now()) {
      req.session.otpData = null;
      return res.status(400).json({ error: "OTP expired" });
    }

    if (record.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    const { name, email, phone, password } = record.userData;

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      phone,
      name,
      password: hashed
    });

    req.session.otpData = null;

    return res.json({
      success: true,
      message: "User created",
      userId: user._id
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

  export const resendOTP = async (req, res) => {
  try {
   

    const record = req.session.otpData
     if(!record){
      return res.status(400).json({error:"Session expired. please signup again"})

     }

     
    if ( Date.now() - record.createdAt < 30 * 1000) {
      return res.status(400).json({
        error: "Please wait before requesting another OTP"
      });
    }

    const otp = generateOTP();

    req.session.otpData = {
      ...record,
      otp,
      expires :Date.now()+2*60*1000,
      createdAt:Date.now()
    }

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: record.userData.email,
      subject: "Resent OTP",
      text: `Your new OTP is ${otp}`
    });

    return res.json({
      success: true,
      message: "OTP resent successfully"
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to resend OTP" });
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

         req.session.user = {
         id: user._id,
         username: user.name
         };

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
    res.render("user/home",{user:req.session.user})
  }
   
 
 
  export const logout = (req, res) => {
    try{
  req.session.destroy((err) => {
    if(err){
      console.log(err)
      return res.status(500).send("Logout failed")
    }
    res.json({success:true})
   
  });
}catch(err){
  res.status(500).send(err.message)

}
};


export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"]
});
export const googleCallback = [
  passport.authenticate("google", {
    failureRedirect: "/user/login"
  }),
  (req, res) => {
    req.session.user={
      id:req.user._id,
      username:req.user.displayName||req.user.name
    }
    res.redirect("/user/home");
  }
];


export const loadForgotPassword =((req,res)=>{
  res.render("user/forgot-password")
})



export const sendForgotPasswordOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        message: "If this email exists, a reset link has been sent"
      });
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 3600000;

    await user.save();

    const resetLink = `http://localhost:3000/user/reset-password/${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset",
      html: `<p>Click to reset password:</p>
             <a href="${resetLink}">${resetLink}</a>`
    });

    res.json({ message: "Reset link sent" });
    console.log(resetLink)
  } catch (err) {
    console.log("ERROR 👉", err);
    res.status(500).json({ message: err.message });
  }
};


export const loadresetPassword=((req,res)=>{
  res.render("user/reset-password", { token: req.params.token });
})


// ================= RESET PASSWORD =================
export const resetPassword = async (req, res) => {
  const token = req.params.token.trim();
  const { password } = req.body;

  try {
    if (!password || password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters"
      });
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token"
      });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = null;
    user.resetTokenExpiry = null;

    await user.save();

    // optional: destroy session
    req.session.destroy(() => {});

    res.json({
      success: true,
      message: "Password reset successful"
    });

  } catch (err) {
    console.log("RESET PASSWORD ERROR 👉", err);
    res.status(500).json({ message: err.message });
  }
};


// ================= VERIFY USER =================
export const verifyUser = (req, res) => {
  res.json({
    success: true,
    message: "verified successfully",
  });
};

export const getProfile = async (req, res, next) => {
  try {
    if (!req.session.user) {
      return res.redirect("/user/login");
    }

    const user = await User.findById(req.session.user._id);

    if (!user.addresses) {
      user.addresses = [];
    }

    res.render("user/profile", { user }); // ✅ fixed path
  } catch (err) {
    next(err);
  }
};




export const verifyForgotOTP = (req, res) => {
  try {
    const { otp } = req.body;

    if (!req.session.resetOTP || !req.session.resetEmail) {
      return res.json({
        success: false,
        error: "Session expired"
      });
    }

    if (Date.now() > req.session.resetExpiry) {
      return res.json({
        success: false,
        error: "OTP expired"
      });
    }

    if (String(otp) !== String(req.session.resetOTP)) {
      return res.json({
        success: false,
        error: "Invalid OTP"
      });
    }

    res.json({
      success: true,
      message: "OTP verified"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
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
    verifySignupOTP,
    resendOTP,
    googleAuth,
    googleCallback,
    loadForgotPassword,
    loadresetPassword,
    resetPassword,
    verifyForgotOTP,
    sendForgotPasswordOTP
    

    
    
}
