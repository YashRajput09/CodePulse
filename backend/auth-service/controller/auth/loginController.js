// import mongoose from 'mongoose';
import userModel from '../../models/user_model.js';
import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
import createTokenAndSaveCookie from '../../jwt/AuthenticateToken.js';

const loginUser = async (req, res) =>{
    const { email, password} = req.body;
    try {   
    if(!email || !password){
        return res.status(400).json({message: "All fields are required"});
    }
    const user = await userModel.findOne({email}).select('+password');
    if(!user){
        return res.status(404).json({message: "User not found"});
    }
    console.log("user : ", user);
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    // console.log(isValidPassword);
    
    if(!isValidPassword){
        return res.status(400).json({message: "Invalid email or password"});
    }

    const token  = await createTokenAndSaveCookie(user._id, res);
    console.log("token : ", token);
    
    // return loggers.info(`User logged in successfully: ${user.email}`, {user:{
    //     user: user._id,
    //     name: user.name,
    //     email: user.email
    // }, jwttoken: token, });
    res.status(200).json({message: "User logged in successfully", token});
} catch (error) {
    console.log(error);
    
    return res.status(400).json({ error: "Invalid credentials",error });
}
}

export default loginUser;