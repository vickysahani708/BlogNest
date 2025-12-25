import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    role: {
        type:String,
        default:'user',
        enum:['user','admin'],
        required:true,
        trim:true
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
    },
    bio: {
      type: String,
      trim:true
    },
    avatar: {
      type: String,
      trim:true
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

const User = mongoose.model("User", userSchema,'users');
export default User;