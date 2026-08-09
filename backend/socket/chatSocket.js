const jwt = require("jsonwebtoken");
const Chat = require("../models/Chat");
const User = require("../models/User");

const getToken = (socket) => {
  if (socket.handshake.auth?.token) return socket.handshake.auth.token;
  const cookieHeader = socket.handshake.headers.cookie || "";
  const match = cookieHeader.match(/(?:^|;\s*)token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
};

const canAccessChat = async (chatId, userId) => {
  const chat = await Chat.findById(chatId).select("buyer seller");
  return Boolean(chat && (chat.buyer.equals(userId) || chat.seller.equals(userId)));
};

module.exports = function chatSocket(io) {
  io.use(async (socket, next) => {
    try {
      const token = getToken(socket);
      if (!token) return next(new Error("Authentication required"));

      const { id } = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(id).select("_id role status");
      if (!user || user.status === "blocked") return next(new Error("Authentication required"));

      socket.user = user;
      next();
    } catch {
      next(new Error("Authentication required"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("joinUser", (userId) => {
      if (userId && socket.user._id.equals(userId)) socket.join(socket.user._id.toString());
    });

    socket.on("joinChat", async (chatId) => {
      if (chatId && (await canAccessChat(chatId, socket.user._id))) socket.join(chatId.toString());
    });

    socket.on("leaveChat", (chatId) => {
      if (chatId) socket.leave(chatId.toString());
    });

    socket.on("sendMessage", async ({ chatId, message }) => {
      if (chatId && message && (await canAccessChat(chatId, socket.user._id))) {
        io.to(chatId.toString()).emit("newMessage", message);
      }
    });

    socket.on("typing", async ({ chatId, isTyping }) => {
      if (chatId && (await canAccessChat(chatId, socket.user._id))) {
        socket.to(chatId.toString()).emit("userTyping", { userId: socket.user._id, isTyping: Boolean(isTyping) });
      }
    });
  });
};
