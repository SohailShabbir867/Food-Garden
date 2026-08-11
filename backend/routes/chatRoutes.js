// backend/routes/chatRoutes.js

const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getMyChats,
  getChatMessages,
  createChat,
  sendMessage,
  markMessagesRead,
} = require("../controllers/chatController");

// Protect all chat routes (requires valid JWT token)
router.use(protect);

router.get("/", getMyChats);
router.post("/", createChat);
router.get("/:chatId/messages", getChatMessages);
router.post("/:chatId/messages", sendMessage);

// Mark all messages from the other party as read (HTTP fallback).
// Primary read-receipt path is the Socket.IO `markRead` event.
router.put("/:chatId/read", markMessagesRead);

module.exports = router;
