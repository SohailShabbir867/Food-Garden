// backend/socket/chatSocket.js
// Real-time text chat over Socket.io (messages only — no voice/video call signaling here).
// Wire this up in server.js: require("./socket/chatSocket")(io);

module.exports = function chatSocket(io) {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // Join a personal room so we can target this user directly
    socket.on("join", (userId) => {
      socket.join(userId);
    });

    // Join a specific chat thread room
    socket.on("joinChat", (chatId) => {
      socket.join(chatId);
    });

    // Relay a new message to everyone in the chat thread
    socket.on("sendMessage", ({ chatId, message }) => {
      io.to(chatId).emit("newMessage", message);
    });

    // Basic typing indicator
    socket.on("typing", ({ chatId, userId }) => {
      socket.to(chatId).emit("userTyping", { userId });
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
};
