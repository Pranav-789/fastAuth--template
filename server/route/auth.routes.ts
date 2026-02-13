import { Router } from "express";
import {forgotPassword, loginUser, logout, refreshAuthTokens, registerUser, resetPassword, verifyEmail} from "../controller/auth.controller.js";

const router = Router();

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/logout', logout)
router.post('/refresh-tokens', refreshAuthTokens)
router.get('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router