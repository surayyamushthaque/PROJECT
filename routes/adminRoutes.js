
import express from "express";
import adminroute from "../controllers/admincontroller.js";
import admin from "../models/admin.js";

const router = express.Router();



router.get("/login",(req,res)=>{
    res.render("admin/login",{error:null})
})
router.get("/login",adminroute.loadLogin )
router.post("/login",adminroute.adminLogin)
router.get("/dashboard",adminroute.loadDashboard)
router.get("/logout", adminroute.adminLogout)
router.get("/dashboard",adminroute.isAdmin,adminroute.loadDashboard)
router.get("/dashboard",adminroute.dashboardData)
router.get("/users", adminroute.isAdmin, adminroute.getUsers);
router.patch("/user/block/:id",adminroute.toggleBlockUser)
export default router;
