// backend/middleware/requestLogger.js
const logger = require("../utils/logger");

const requestLogger = (req, res, next) => {
  const startHighRes = process.hrtime();

  // Listen to response finish event to capture completion metrics
  res.on("finish", () => {
    const diff = process.hrtime(startHighRes);
    const timeInMs = (diff[0] * 1000 + diff[1] / 1e6).toFixed(2);
    const contentLength = res.getHeader("content-length") || null;

    const user = req.user
      ? {
          id: req.user._id ? req.user._id.toString() : req.user.id,
          role: req.user.role || "user",
        }
      : null;

    const ip = req.headers["x-forwarded-for"] || req.socket?.remoteAddress || req.ip;

    logger.http({
      method: req.method,
      url: req.originalUrl || req.url,
      status: res.statusCode,
      responseTime: timeInMs,
      user,
      ip,
      contentLength,
    });
  });

  next();
};

module.exports = { requestLogger };
