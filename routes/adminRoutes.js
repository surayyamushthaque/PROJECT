
import express from "express";
import adminroute from "../controllers/admin/admincontroller.js";
import admin from "../models/admin.js";
import {authMiddleware} from "../middlewares/Auth.js"
const router = express.Router();
import catogory from "../controllers/admin/categoryController.js"


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
router.patch("/user/block/:id", adminroute.isAdmin, adminroute.toggleBlockUser)
router.post("/block-user/:id",authMiddleware,adminroute.blockUser);
router.post("/unblock-user/:id", authMiddleware,adminroute.unblockUser);



router.get("/category",adminroute.loadCategory)
router.post("/",catogory.addCategory)
router.put("/:id",catogory.updateCategory)
router.delete("/:id",catogory.deleteCategory)
router.get("/",catogory.getCategory)

router.get("/productmanager",adminroute.loadProductManager)

export default router;
