import express from "express";
import { check, login, register, verifyAccount } from "../controllers/auth.js";

const router = express.Router();
router.post("/check", check)
router.post("/register", register)
router.post("/verify-account", verifyAccount)
router.post("/login", login)

export default router