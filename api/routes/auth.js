import express from "express";
import { 
    check, 
    login, 
    register,
    resetPassword, 
    verifyAccount, 
    verifyResetPasswordRequest 
} from "../controllers/auth.js";

const router = express.Router();
router.post("/check", check)
router.post("/register", register)
router.post("/reset-password", resetPassword)
router.post("/verify-password", verifyResetPasswordRequest)
router.post("/verify-account", verifyAccount)
router.post("/login", login)

export default router