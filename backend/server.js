const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const http = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
require("./config/nodemailer");

const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const adminRoutes = require("./routes/adminRoutes");
const createVendorRoutes = require("./routes/vendorRoutes");
const contactRoutes = require("./routes/contactRoutes");
const foodRoutes = require("./routes/foodRoutes");
const orderRoutes = require("./routes/orderRoutes");
const chatSocket = require("./socket/chatSocket");
const logger = require("./utils/logger");
const { requestLogger } = require("./middleware/requestLogger");
const { checkSecurityBlock } = require("./middleware/securityMiddleware");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();
const server = http.createServer(app);
const clientOrigin = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:3000"
].filter(Boolean);

app.use(cors({ origin: clientOrigin, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(requestLogger); // Log all incoming API requests, endpoints, status codes, response times, and users
app.use(checkSecurityBlock); // Enforce IP / Device MAC blocklist

const io = new Server(server, { cors: { origin: clientOrigin, credentials: true } });
chatSocket(io);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/vendor", createVendorRoutes(io));
app.use("/api/contact", contactRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/orders", orderRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const startServer = async () => {
  await connectDB();
  server.listen(PORT, () => {
    logger.info(`Food Garden API running on http://localhost:${PORT}`);
  });
};

startServer().catch((error) => {
  logger.error("Unable to start Food Garden API:", error);
  process.exit(1);
});

