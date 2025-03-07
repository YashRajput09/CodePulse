import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';
import userModel from '../models/user_model.js';


const createTokenAndSaveCookie = async (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
    res.cookie("jwttoken", token, {
        httpOnly: true,
        sameSite: "none",
        secure: false,  // For development (set to true in production with HTTPS) 
        maxAge: 24 * 60 * 60 * 1000,
    });
    await userModel.findByIdAndUpdate(userId, { token });
    return token;
}

export default createTokenAndSaveCookie;