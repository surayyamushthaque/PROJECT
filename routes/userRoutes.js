import express from "express"
const router =express.Router()
import usercontroller from "../controllers/user/userController.js"
import { signupValidator } from "../middlewares/authvalidator.js"
import handleValidation from "../middlewares/handlevalidation.js"
import passport from "passport";
import {googleAuth, googleCallback} from "../controllers/user/userController.js"
import { isLoggedIn } from "../middlewares/Auth.js";
import userprofile from "../controllers/services/user/userprofilecontroller.js";
import {authMiddleware} from "../middlewares/Auth.js";
import upload from "../middlewares/multerMiddleware.js";
import { 
  sendEmailOtp, 
  verifyEmailOtp, 
  changePassword, 
  postChangePassword,
  updateProfile 
} from "../controllers/services/user/userprofilecontroller.js";
import { getVerifyEmailPage } from "../controllers/services/user/userprofilecontroller.js";
import profileAddress from "../controllers/services/user/addressController.js";


router.get("/",usercontroller.landingPage)
router.get("/user/signup",usercontroller.loadSignup)

router.get("/user/login",usercontroller.loadLanding)
router.post("/user/login",usercontroller.postLogin)
router.get("/user/home",isLoggedIn, usercontroller.loadHome)
router.post("/user/logout", usercontroller.logout);
router.post("/user/signup", usercontroller.sendSignupOTP);
router.get("/user/verify-otp",usercontroller.loadVerifyOtp)
router.post("/user/verify-otp", usercontroller.verifySignupOTP);
router.post("/user/resend-otp",usercontroller.resendOTP)
router.get("/auth/google",googleAuth);
router.get("/auth/google/callback", googleCallback);
router.get("/user/forgot-password",usercontroller.loadForgotPassword)
router.post("/user/forgot-password", usercontroller.sendForgotPasswordOTP);
router.post("/user/verify-forgot-otp", usercontroller.verifyForgotOTP);
router.get("/user/reset-password/:token", usercontroller.loadresetPassword);
router.post("/user/reset-password/:token",usercontroller.resetPassword)



// router.get("/user/profile/edit", isLoggedIn, userprofile.getEditProfile);
router.get("/user/profile", authMiddleware, userprofile.getProfile);
router.get("/profile/edit",authMiddleware,userprofile.getEditProfile)
router.post("/profile/edit",authMiddleware,userprofile.updateProfile)
// 🔹 EMAIL OTP


router.post("/profile/send-otp", isLoggedIn, sendEmailOtp);
router.post("/profile/verify-otp", isLoggedIn, verifyEmailOtp);
router.get("/profile/verify-email", isLoggedIn, getVerifyEmailPage);



// Change Password (preferred)
router.get("/user/profile/change-password", isLoggedIn, changePassword);
router.post("/user/profile/change-password", isLoggedIn, postChangePassword);

// Backwards-compatible routes (keep existing links working)
router.get("/change-password", isLoggedIn, changePassword);
router.post("/change-password", isLoggedIn, postChangePassword);


router.post("/user/profile/edit", isLoggedIn, upload.single("profileImage"), updateProfile);



// Address management (preferred)
router.get("/user/addresses", isLoggedIn, profileAddress.listAddressesPage);
router.post("/user/addresses/add", isLoggedIn, profileAddress.addAddress);
router.get("/user/addresses/edit/:id", isLoggedIn, profileAddress.editAddressPage);
router.post("/user/addresses/edit/:id", isLoggedIn, profileAddress.updateAddress);
router.post("/user/addresses/delete/:id", isLoggedIn, profileAddress.deleteAddress);

// Backwards-compatible aliases (keep existing links working)
router.get("/address", isLoggedIn, profileAddress.listAddressesPage);
router.post("/add", isLoggedIn, profileAddress.addAddress);
router.get("/address/edit/:id", isLoggedIn, profileAddress.editAddressPage);
router.post("/address/edit/:id", isLoggedIn, profileAddress.updateAddress);
router.post("/address/delete/:id", isLoggedIn, profileAddress.deleteAddress);

export default router
