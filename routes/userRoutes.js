import express from "express"
const router =express.Router()
import usercontroller from "../controllers/userController.js"
import { signupValidator } from "../middlewares/authvalidator.js"
import handleValidation from "../middlewares/handlevalidation.js"
import passport from "passport";
import {googleAuth, googleCallback} from "../controllers/userController.js"
import { isLoggedIn } from "../middlewares/Auth.js";



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






export default router
