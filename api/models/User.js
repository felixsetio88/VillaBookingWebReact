import mongoose from "mongoose";
const UserSchema = new mongoose.Schema(
  {

    firstname:{
      type: String,
      required: true,
    },
    lastname:{
      type: String,
      required: true,
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

  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
