import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: true,
    minlength: [8, "Password must be at least 8 characters long"],
    validator: function (value) {
      return validator.isStrongPassword(value, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      });
    },
    message:
      "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
  },
  mobileNumber: {
    type: Number,
    required: true,
    unique: true,
    minlength: 10,
    maxlength: 10,
  },
  profileImage: {
    public_id: { type: String, required: true },
    url: { type: String, required: true },
  },
  technologiesLearning: [String],
  role: {
    type: String,
    required: true,
    enum: ["Admin", "Member"],
    default: "Member",
  },
  cratedAt: { type: Date, default: Date.now },
  jwttoken: { type: String },
});

const User = mongoose.model("User", userSchema);
export default User;
