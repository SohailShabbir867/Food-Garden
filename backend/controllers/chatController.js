// backend/controllers/chatController.js
// Route handlers for chat threads and messages.
// Business logic (DB calls) to be filled in once Chat/Message models are wired up.

// GET /api/chats  -> list all chat threads for the logged-in user
const getMyChats = async (req, res) => {
  res.status(501).json({ message: "Not implemented yet" });
};

// GET /api/chats/:chatId/messages -> get message history for a thread
const getChatMessages = async (req, res) => {
  res.status(501).json({ message: "Not implemented yet" });
};

// POST /api/chats  -> start a new chat thread between buyer and seller
const createChat = async (req, res) => {
  res.status(501).json({ message: "Not implemented yet" });
};

// POST /api/chats/:chatId/messages -> send a message in a thread
const sendMessage = async (req, res) => {
  res.status(501).json({ message: "Not implemented yet" });
};

module.exports = {
  getMyChats,
  getChatMessages,
  createChat,
  sendMessage,
};
