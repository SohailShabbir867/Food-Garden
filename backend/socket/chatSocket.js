// backend/socket/chatSocket.js
// Real-time two-way text chat and support ticket signaling over Socket.io.

module.exports = function chatSocket(io) {
  io.on("connection", (socket) => {
    console.log("⚡ Socket connected:", socket.id);

    // Join a personal room for direct user notifications
    socket.on("joinUser", (userId) => {
      if (userId) {
        socket.join(userId.toString());
        console.log(`Socket ${socket.id} joined user room: ${userId}`);
      }
    });

    // Join a specific chat thread room
    socket.on("joinChat", (chatId) => {
      if (chatId) {
        socket.join(chatId.toString());
        console.log(`Socket ${socket.id} joined chat room: ${chatId}`);
      }
    });

    // Leave a chat room
    socket.on("leaveChat", (chatId) => {
      if (chatId) {
        socket.leave(chatId.toString());
        console.log(`Socket ${socket.id} left chat room: ${chatId}`);
      }
    });

    // Relay a new message to everyone in the chat thread in real-time
    socket.on("sendMessage", ({ chatId, message }) => {
      if (chatId && message) {
        io.to(chatId.toString()).emit("newMessage", message);
      }
    });

    // Relay contact support ticket reply
    socket.on("sendContactReply", ({ ticketId, reply }) => {
      if (ticketId && reply) {
        io.to(`contact_${ticketId}`).emit("newContactReply", reply);
      }
    });

    // Real-time typing indicators
    socket.on("typing", ({ chatId, userId, isTyping }) => {
      if (chatId) {
        socket.to(chatId.toString()).emit("userTyping", { userId, isTyping });
      }
    });

    socket.on("disconnect", () => {
      console.log("🔌 Socket disconnected:", socket.id);
    });
  });
};
