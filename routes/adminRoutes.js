
import multer from 'multer';
import express from "express";
import adminroute from "../controllers/admin/admincontroller.js";
import { authMiddleware } from "../middlewares/Auth.js";
import categoryController from "../controllers/admin/categoryController.js";

const router = express.Router();


router.get("/login", adminroute.loadLogin);
router.post("/login", adminroute.adminLogin);
router.get("/logout", adminroute.adminLogout);


router.get("/dashboard", adminroute.isAdmin, adminroute.loadDashboard);

router.get("/users", adminroute.isAdmin, adminroute.getUsers);
router.patch("/user/block/:id", adminroute.isAdmin, adminroute.toggleBlockUser);
router.post("/block-user/:id", authMiddleware, adminroute.blockUser);
router.post("/unblock-user/:id", authMiddleware, adminroute.unblockUser);


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/category');
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
 
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  ext && mime ? cb(null, true) : cb(new Error('Images only (jpeg/jpg/png/webp)'));
};
 
const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
 

router.get('/admin/category',adminroute.isAdmin, categoryController.getCategories);
router.get('/category/add',adminroute.isAdmin, categoryController.getAddCategory);
router.post('/category/add',adminroute.isAdmin, upload.single('image'), categoryController.postAddCategory);
 
// router.get('/:id',adminroute.isAdmin, categoryController.getCategoryById);
router.get('/category/:id/edit',adminroute.isAdmin, categoryController.getEditCategory);
router.post('/category/:id/edit',adminroute.isAdmin, upload.single('image'), categoryController.postEditCategory);
 
router.post('/category/:id/list',adminroute.isAdmin, categoryController.listCategory);
router.post('/category/:id/unlist',adminroute.isAdmin, categoryController.unlistCategory);
 
router.get('/category/:id/add-offer',adminroute.isAdmin, categoryController.getAddOffer);
router.post('/category/:id/add-offer',adminroute.isAdmin, categoryController.postAddOffer);
router.post('/category/:id/remove-offer',adminroute.isAdmin,categoryController.removeOffer);


router.get("/category/productmanager", adminroute.loadProductManager);

export default router;