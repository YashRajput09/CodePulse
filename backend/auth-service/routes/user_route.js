import express from "express";
import signUpUser from "../controller/auth/signupController.js"; 
import loginUser from "../controller/auth/loginController.js";
import logoutUser from "../controller/auth/logoutController.js";
const router = express.Router();

router.route("/signup").post(signUpUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser)
export default router;