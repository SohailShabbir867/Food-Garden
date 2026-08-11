const jwt = require("jsonwebtoken");
const Chat = require("../models/Chat");
const Message = require("../models/Message");
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
    // ── Join the user's personal room (for order status updates etc.) ──
    socket.on("joinUser", (userId) => {
      if (userId && socket.user._id.equals(userId)) socket.join(socket.user._id.toString());
    });

    // ── Join a specific chat room ──────────────────────────────────────
    socket.on("joinChat", async (chatId) => {
      if (chatId && (await canAccessChat(chatId, socket.user._id))) {
        socket.join(chatId.toString());
      }
    });

    // ── Leave a chat room ──────────────────────────────────────────────
    socket.on("leaveChat", (chatId) => {
      if (chatId) socket.leave(chatId.toString());
    });

    // ── Send a message (real-time relay to the other party) ────────────
    socket.on("sendMessage", async ({ chatId, message }) => {
      if (chatId && message && (await canAccessChat(chatId, socket.user._id))) {
        io.to(chatId.toString()).emit("newMessage", message);
      }
    });

    // ── Typing indicator ───────────────────────────────────────────────
    socket.on("typing", async ({ chatId, isTyping }) => {
      if (chatId && (await canAccessChat(chatId, socket.user._id))) {
        socket.to(chatId.toString()).emit("userTyping", {
          userId: socket.user._id,
          isTyping: Boolean(isTyping),
        });
      }
    });

    // ── Mark messages as read (called when the recipient opens the chat) ──
    //
    // Flow:
    //  1. Recipient opens the chat → frontend emits `markRead` with { chatId }
    //  2. We verify they are a participant, then bulk-mark all unread messages
    //     sent by the OTHER person (not this socket's user) as read=true.
    //  3. We broadcast `messagesRead` to the whole chat room so the SENDER's
    //     screen can flip their grey ticks to green immediately.
    //
    socket.on("markRead", async ({ chatId }) => {
      try {
        if (!chatId) return;
        if (!(await canAccessChat(chatId, socket.user._id))) return;

        // Bulk update: mark every unread message from the other user as read
        const result = await Message.updateMany(
          {
            chat: chatId,
            sender: { $ne: socket.user._id }, // not sent by ME (I am the reader)
            read: false,
          },
          { $set: { read: true } }
        );

        // Only emit if there was actually something to update (avoid noise)
        if (result.modifiedCount > 0) {
          // Broadcast to everyone in the room (including the original sender)
          io.to(chatId.toString()).emit("messagesRead", {
            chatId,
            readBy: socket.user._id.toString(),
          });
        }
      } catch (err) {
        // Non-fatal — log silently, don't crash the socket
        console.error("[chatSocket] markRead error:", err.message);
      }
    });
  });
};
