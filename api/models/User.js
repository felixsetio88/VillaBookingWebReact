import mongoose from "mongoose";
const UserSchema = new mongoose.Schema(
  {
    firstname:{
      type: String,
      required: true,
    },
    lastname:{
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passportNo:{
      type: String,
      required: true,
      unique: true,
    },
    country: {
      type: String,
      required: true,
    },
    img: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: Number,
      default: null
    },
    verifyAttempts: {
      type: Number,
      default: 0
    },
    /*
    isPasswordChanged: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: {
      type: Number,
      default: null
    } */
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
