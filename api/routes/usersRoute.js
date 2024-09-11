import express from "express";
import {
  updateUser,
  deleteUser,
  getUser,
  getUsers,
  getAllOrders, 
  getMyOrders,
} from "../controllers/user.js";
import { verifyAdmin, verifyToken, verifyUser } from "../utils/verifyToken.js";
import { check } from "../controllers/auth.js";

const router = express.Router();

router.put("/:id", verifyUser, updateUser);
router.delete("/:id", verifyUser, deleteUser);
router.get("/:id", verifyUser, getUser);
router.get("/", verifyAdmin, getUsers);
router.get("/orders", verifyAdmin, getAllOrders);
router.get("/my-orders", verifyUser, getMyOrders);

export default router;
