import express from "express";
import signUpUser from "../controller/auth/signupController.js"; 
const router = express.Router();

router.route("/signup").post(signUpUser);

export default router;