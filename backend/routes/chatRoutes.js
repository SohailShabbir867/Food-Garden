// backend/routes/chatRoutes.js

const express = require("express");
const router = express.Router();
const {
  getMyChats,
  getChatMessages,
  createChat,
  sendMessage,
} = require("../controllers/chatController");

// TODO: add auth middleware once middleware/auth.js exists
router.get("/", getMyChats);
router.post("/", createChat);
router.get("/:chatId/messages", getChatMessages);
router.post("/:chatId/messages", sendMessage);

module.exports = router;
