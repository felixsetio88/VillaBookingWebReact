// orderController.js
import Order from "../models/Order.js";
import User from "../models/User.js";
import Hotel from "../models/Hotel.js";
import moment from 'moment';

// Create a new order
export const createOrder = async (req, res) => {
  const newOrder = new Order(req.body);

  try {
      const savedOrder = await newOrder.save();
      return res.status(200).json(savedOrder);
  } catch (error) {
      alert("Failed to add new order!")
  }
};

// Get all orders made by all customers (admin access only)
export const getAllOrders = async (req, res, next) => {
  
  try {
    if (req.user.isAdmin) {
      console.log(req.user.isAdmin)
      console.log(req.user.firstname)
      const orders = await Order.find();
      res.status(200).json(orders);
    }
    return res.status(403).json({ message: 'Access denied' });
    
  } catch (err) {
    next(err);
  }
};

// Get orders made by the logged-in user
export const getMyOrders = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password")
   
    const orders = await Order.find({ user: user }).populate('hotel');
    console.log(user)
    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};

// Delete an order by ID
export const deleteOrder = async (req, res, next) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order has been deleted.");
  } catch (err) {
    next(err);
  }
};

export const confirmOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { confirmed: true }, { new: true });
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
}

export const cancelOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { canceled: true }, { new: true });
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
}

export const getOrderStats = async (req, res) => {
  try {
    
      const startOfWeek = moment().startOf('isoWeek').toDate();
      const endOfWeek = moment().endOf('isoWeek').toDate();


      const totalRoomNumber = await Order.aggregate([
          { $group: { _id: null, totalRooms: { $sum: "$roomNumber" } } }
      ]);

      const totalAmount = await Order.aggregate([
          { $group: { _id: null, totalAmount: { $sum: "$total" } } }
      ]);

      const totalCanceled = await Order.countDocuments({ canceled: true });

      const totalRoomNumberThisWeek = await Order.aggregate([
          { $match: { orderDate: { $gte: startOfWeek, $lte: endOfWeek } } },
          { $group: { _id: null, totalRooms: { $sum: "$roomNumber" } } }
      ]);

      const totalAmountThisWeek = await Order.aggregate([
          { $match: { orderDate: { $gte: startOfWeek, $lte: endOfWeek } } },
          { $group: { _id: null, totalAmount: { $sum: "$total" } } }
      ]);

      const totalCanceledThisWeek = await Order.countDocuments({
          canceled: true,
          orderDate: { $gte: startOfWeek, $lte: endOfWeek }
      });


      const totalConfirmed = await Order.countDocuments({ confirmed: true });

      const totalProductListed = await Hotel.countDocuments();

      const totalProductViewed = await Hotel.aggregate([
        { $group: { _id: null, totalProductViewed: { $sum: "$viewed" } } }
    ]);

      const totalAccountRegistered = await User.countDocuments();

      const totalNotConfirmed = await Order.countDocuments({ confirmed: false });

      const totalConfirmedThisWeek = await Order.countDocuments({
          confirmed: true,
          orderDate: { $gte: startOfWeek, $lte: endOfWeek }
      });

      
      res.status(200).json({
          totalRoomNumber: totalRoomNumber[0]?.totalRooms || 0,
          totalAmount: totalAmount[0]?.totalAmount || 0,
          totalCanceled,
          totalRoomNumberThisWeek: totalRoomNumberThisWeek[0]?.totalRooms || 0,
          totalAmountThisWeek: totalAmountThisWeek[0]?.totalAmount || 0,
          totalCanceledThisWeek,
          totalConfirmed,
          totalConfirmedThisWeek,
          totalNotConfirmed,
          totalProductListed,
          totalAccountRegistered,
          totalProductViewed: totalProductViewed[0]?.totalProductViewed || 0,

      });
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
}
