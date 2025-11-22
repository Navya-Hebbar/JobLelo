// backend/src/models/userModel.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true,
        lowercase: true,
    },
    passwordHash: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        default: "user" 
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;