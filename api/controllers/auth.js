import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  try {
    if(!req.body.firstname ||
      !req.body.email ||
      !req.body.passportNo ||
      !req.body.country ||
      !req.body.phone ||
      !req.body.password){
    return next(createError(400, "Please fill in all of the required fields!"));
    }

    if(!validator.isEmail(req.body.email)){
      return next(createError(400, "Email is not valid."));
    }

    const checkEmailExists = await User.findOne({ email: req.body.email });
    if(checkEmailExists){
      return next(createError(400, "Email has already been used."));
    }

    const checkPassport = await User.findOne({ passportNo: req.body.passportNo });
    if(checkPassport){
      return next(createError(400, "Passport has already been used."));
    }

    const checkPhone = await User.findOne({ phone: req.body.phone });
    if(checkPhone){
      return next(createError(400, "Phone number has already been used."));
    }
    
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({
      ...req.body,
      password: hash,
    });

    await newUser.save();
    res.status(200).send("User has been created.");
  } catch (err) {
    next(err);
  }
};
export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(createError(404, "User not found!"));

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect)
      return next(createError(400, "Wrong password or username!"));

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT
    );

    const { password, isAdmin, ...otherDetails } = user._doc;
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({ details: { ...otherDetails }, isAdmin });
  } catch (err) {
    next(err);
  }
};
export const check = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(createError(404, "User not found!"));

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect){
      return next(createError(400, "Wrong password or username!"));
    }

    res.status(200).send("email and password correct.")
  } catch (err) {
    next(err);
  }
};
