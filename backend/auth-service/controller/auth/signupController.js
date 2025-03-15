import userModel from "../../models/user_model.js";
import cloudinary from "../../config/cloudConfig.js";
import bcrypt from "bcryptjs";
import createTokenAndSaveCookie from "../../jwt/AuthenticateToken.js";

const signUpUser = async (req, res) => {
    console.log(req.files);
    
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res
        .status(400)
        .json({ message: "User profile image is required" });
    }
    const { profileImage } = req.files;
    const allowedFormates = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/pdf",
    ];
    if (!allowedFormates.includes(profileImage.mimetype)) {
      return res.status(400).json({
        message: "Invalid image formate, only jpeg, jpg, png, pdf are allowed",
      });
    }

    const {
      name,
      email,
      password,
      mobileNumber,
      technologiesLearning,
      role,
      createdAt,
    } = req.body;
    if (
      !name ||
      !email ||
      !password ||
      !mobileNumber ||
      !technologiesLearning ||
      !role
      // !profileImage
    ) {
      res.status(404).json({ message: "All fields are required" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(
      profileImage.tempFilePath,
      {
        folder: "CodePulse",
      }
    );
    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.log(cloudinaryResponse.error);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = userModel({
      name,
      email,
      password: hashedPassword,
      mobileNumber,
      profileImage: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      },
      technologiesLearning,
      role,
      createdAt,
    });
    await newUser.save();

    if (newUser) {
      const token = await createTokenAndSaveCookie(newUser._id, res);
      return res
        .status(201)
        .json({ message: "User created successfully", newUser, token: token });
    }
    console.log("New response : ", newUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default signUpUser;