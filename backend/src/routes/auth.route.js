import express from "express";
import { signup, login, logout, updateprofile } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js"; // optional if you have auth check

const router = express.Router();

// Public routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// Protected routes
router.put("/update-profile", requireAuth, updateprofile);

export default router;
