import express from "express";
import { check, login, register } from "../controllers/auth.js";

const router = express.Router();
router.post("/check", check)
router.post("/register", register)
router.post("/login", login)

export default router