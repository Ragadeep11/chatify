import express from "express";
import { getAllContacts, getMessagesByUserId, sendMessage,getChatPartners } from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";
const router = express.Router();
router.use(arcjetProtection,protectRoute);

// Get all contacts (except logged-in user)
router.get("/contacts", getAllContacts);
router.get("/chats",getChatPartners);

// Get chat messages with a specific user
router.get("/:id", getMessagesByUserId);

// Send a message (with optional image)
router.post("/send/:id", sendMessage);

export default router;
