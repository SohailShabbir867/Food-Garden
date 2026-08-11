// backend/controllers/chatController.js
// Route handlers for chat threads and messages with full MongoDB integration.

const Chat = require("../models/Chat");
const Message = require("../models/Message");
const User = require("../models/User");

const isParticipant = (chat, userId) =>
  chat.buyer.equals(userId) || chat.seller.equals(userId);

// GET /api/chats -> list all chat threads for the logged-in user
const getMyChats = async (req, res) => {
  try {
    const userId = req.user._id;
    const chats = await Chat.find({
      $or: [{ buyer: userId }, { seller: userId }],
    })
      .populate("buyer", "name email role avatar")
      .populate("seller", "name email role avatar restaurantName")
      .sort({ lastMessageAt: -1 });

    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch chats", error: error.message });
  }
};

// GET /api/chats/:chatId/messages -> get message history for a thread
const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: "Chat thread not found" });
    if (!isParticipant(chat, req.user._id)) return res.status(403).json({ message: "Forbidden" });

    const messages = await Message.find({ chat: chatId })
      .populate("sender", "name email avatar")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch messages", error: error.message });
  }
};

// POST /api/chats -> start or get existing chat thread
const createChat = async (req, res) => {
  try {
    const { recipientId, orderId } = req.body;
    if (!recipientId) {
      return res.status(400).json({ message: "Recipient ID is required" });
    }

    const userId = req.user._id;

    if (userId.equals(recipientId)) {
      return res.status(400).json({ message: "You cannot start a chat with yourself" });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient || recipient.status === "blocked") {
      return res.status(404).json({ message: "Recipient is not available" });
    }

    // Check if chat thread already exists
    let chat = await Chat.findOne({
      $or: [
        { buyer: userId, seller: recipientId },
        { buyer: recipientId, seller: userId },
      ],
    });

    if (!chat) {
      chat = await Chat.create({
        buyer: userId,
        seller: recipientId,
        orderId: orderId || null,
        lastMessage: "Chat started",
        lastMessageAt: new Date(),
      });
    }

    chat = await chat.populate("buyer seller", "name email role avatar restaurantName");
    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ message: "Failed to create chat", error: error.message });
  }
};

// POST /api/chats/:chatId/messages -> send a message in a thread
const sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Message text is required" });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat thread not found" });
    }
    if (!isParticipant(chat, req.user._id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const message = await Message.create({
      chat: chatId,
      sender: req.user._id,
      text: text.trim(),
      read: false, // explicit — starts as unread
    });

    // Update chat last message timestamp
    chat.lastMessage = text.trim();
    chat.lastMessageAt = new Date();
    await chat.save();

    const populatedMessage = await Message.findById(message._id).populate("sender", "name email avatar");
    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: "Failed to send message", error: error.message });
  }
};

// PUT /api/chats/:chatId/read
// HTTP fallback for marking messages as read (used on page load / refresh).
// The primary path is the Socket.IO `markRead` event in chatSocket.js;
// this endpoint ensures read status is persisted even when the socket
// hasn't connected yet (e.g. slow network on first load).
const markMessagesRead = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id;

    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });
    if (!isParticipant(chat, userId)) return res.status(403).json({ message: "Forbidden" });

    // Mark all messages in this chat NOT sent by the current user as read
    const result = await Message.updateMany(
      { chat: chatId, sender: { $ne: userId }, read: false },
      { $set: { read: true } }
    );

    res.json({ message: "Messages marked as read", updated: result.modifiedCount });
  } catch (error) {
    res.status(500).json({ message: "Failed to mark messages as read", error: error.message });
  }
};

module.exports = {
  getMyChats,
  getChatMessages,
  createChat,
  sendMessage,
  markMessagesRead,
};
