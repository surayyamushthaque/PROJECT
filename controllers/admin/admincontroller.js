
import User from "../../models/user.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import nodemailer from "nodemailer";
import passport from "passport";
import dotenv from "dotenv"; 
import {getUsersService,toggleBlockUserService,} from "../services/admin/user-service.js";
dotenv.config();

export const loadLogin = (req,res)=>{
    try{
        if(req.session.admin){
            return res.redirect("/admin/dashboard")
        }
        res.render("admin/login")
    }catch(err){
        console.log(err)
        res.status(500).send("server error")
    }
}



export const adminLogin =(req,res)=>{
    try{
  const {email,password}=req.body;
  if(email==="admin@gmail.com" && password === "1234"){
    req.session.admin = true;
    return res.json({message:"Login success"})
  }
  return res.json(401).json({message:"Invalid credentials"})
}catch(err){
    console.log(err)
    res.status(500).json({message:"Server error"})
}
}



export const loadDashboard =(req,res)=>{
    try{
        if(!req.session.admin){
            return res.redirect("/login")
        }
         res.render("admin/dashboard")
    }catch(err){
        console.log(err)
        res.status(500).send("Server Error")
    }
}

export const adminLogout = (req,res)=>{
    try{
        req.session.destroy((err)=>{
            if(err){
                return res.status(500).send("Logout failed")
            }
            res.clearCookie("connect.sid")
            res.redirect("/admin/login")
        })
    }catch(err){
        console.log(err)
            res.status(500).send("Server Error")
        
    }
}


export  const dashboardData = (req,res)=>{
    res.json({
        totalSales:12000,
        totalOrders:45,
        totalUsers:20,

        orders:[
            {date: "19 Mar 2023", product:"Hublot",amount:46700,status:"processing"},
            { date: "7 Feb 2023", product: "Rolex", amount: 56800, status: "Completed" },
             { date: "29 Jan 2023", product: "Titan", amount: 42000, status: "Completed" }
            ],
            chartData: [5000, 7000,3000]

    })
}

export const isAdmin = (req,res,next)=>{
    if(req.session.admin){
        next()

    }else{
        res.redirect("admin/login")
    }
}


export const toggleBlockUser = async(req,res)=>{
    const user = await User.findById(req.params.id)
    user.isBlocked = !user.isBlocked;
    await user.save()
    res.json({message:"updated"})
}


// controller/adminController.js
export const getUsers = async (req, res) => {
  try {
    const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = req.query.search || "";

    let filter = {};

    if (search.trim() !== "") {
      filter = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } }
        ]
      };
    }

    const users = await User.find(filter)
      .sort({ createdAt: sortOrder })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(filter);

    console.log(users);

    res.render("admin/users", {
      search,
      users,
      total,
      page
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const blockUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isBlocked: true });
    res.redirect("/admin/users");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error blocking user");
  }
};
// UNBLOCK USER
export const unblockUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isBlocked: false });
    res.redirect("/admin/users");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error unblocking user");
  }
};

export default{
   adminLogin,
   loadLogin , 
    loadDashboard,
    adminLogout,
    isAdmin,
    dashboardData,
    getUsers,
    toggleBlockUser,
    unblockUser,
    blockUser 
    
}


