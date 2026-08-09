// backend/server.js
// Entry point: Express app + MongoDB + Socket.io, all wired together.

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const http = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
require("./config/nodemailer"); // verifies Gmail creds on boot (logs success/failure)

const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const chatSocket = require("./socket/chatSocket");
const { notFound, errorHandler } = require("./middleware/errorHandler");

connectDB();

const app = express();
const server = http.createServer(app);

// ── Core middleware ──────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// ── Socket.io ────────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  },
});
chatSocket(io);

// ── Routes ───────────────────────────────────────────────────
app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);

// ── Error handling (must be last) ────────────────────────────
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Food Garden API running on http://localhost:${PORT}`);
});
