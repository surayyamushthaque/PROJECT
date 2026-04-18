import express from "express"
const router =express.Router()
import usercontroller from "../controllers/userController.js"
import { signupValidator } from "../middlewares/authvalidator.js"
import handleValidation from "../middlewares/handlevalidation.js"
router.get("/",usercontroller.landingPage)
router.get("/user/signup",usercontroller.loadSignup)

router.get("/user/login",usercontroller.loadLanding)
router.post("/user/login",usercontroller.postLogin)
router.get("/user/home",usercontroller.loadHome)
router.post("/user/logout", usercontroller.logout);
router.post("/user/signup", usercontroller.sendSignupOTP);
router.get("/user/verify-otp",usercontroller.loadVerifyOtp)
router.post("/user/verify-otp", usercontroller.verifySignupOTP);









export default router
