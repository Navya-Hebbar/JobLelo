import mongoose from "mongoose";

// Defines the structure for a user document in MongoDB
const userSchema = new mongoose.Schema(
  {
    // Email is required and must be unique in the database
    email: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true,
        lowercase: true,
    },
    // Stores the hashed version of the password for security
    passwordHash: { 
        type: String, 
        required: true 
    },
    // Default role for a new user
    role: { 
        type: String, 
        default: "user" 
    },
  },
  // Automatically adds 'createdAt' and 'updatedAt' fields
  { timestamps: true }
);

// Export the Mongoose model based on the schema
export const User = mongoose.model("User", userSchema);