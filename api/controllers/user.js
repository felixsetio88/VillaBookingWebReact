import User from "../models/User.js";

import Order from "../models/Order.js";
export const updateUser = async (req,res,next)=>{
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
}
export const deleteUser = async (req,res,next)=>{
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted.");
  } catch (err) {
    next(err);
  }
}
export const getUser = async (req,res,next)=>{
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}
export const getUsers = async (req,res,next)=>{
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
}
export const getAllOrders = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).send('Access denied');
    }
    const orders = await Order.find().populate('user').populate('villa');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get orders for the logged-in user
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('villa');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};