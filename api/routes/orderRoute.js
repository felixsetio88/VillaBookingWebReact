import { verifyAdmin, verifyToken, verifyUs, verifyUser} from "../utils/verifyToken.js"
import express from "express";
import { cancelOrder, confirmOrder, createOrder, deleteOrder, getAllOrders, getMyOrders, getRevenueGraph, getOrderStats, getRoomSoldGraph } from "../controllers/order.js";
const router = express.Router();

router.post('/create-order', verifyUser, createOrder);
router.get('/orders/', verifyAdmin, getAllOrders)
router.get('/myorder/', verifyUser, getMyOrders)
router.patch('/confirm/:id', verifyAdmin, confirmOrder)
router.patch('/cancel/:id', verifyAdmin, cancelOrder)
router.delete('/delete/:id', verifyAdmin, deleteOrder)
router.get("/stats/", verifyAdmin, getOrderStats)
router.get("/revenue-graph/", verifyAdmin, getRevenueGraph)
router.get("/room-graph/", verifyAdmin, getRoomSoldGraph)

export default router;