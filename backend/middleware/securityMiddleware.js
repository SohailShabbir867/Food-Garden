// backend/middleware/securityMiddleware.js
const BlockedEntity = require("../models/BlockedEntity");
const { getClientIp } = require("../utils/geoIpHelper");

/**
 * Gatekeeper middleware that verifies the incoming IP and Device MAC are not blocked.
 */
const checkSecurityBlock = async (req, res, next) => {
  try {
    const ip = getClientIp(req);
    const deviceMac = req.headers["x-device-mac"] || req.body?.deviceMac;

    const query = [
      { type: "ip", value: ip, isActive: true },
    ];

    if (deviceMac && deviceMac !== "Unknown Device") {
      query.push({ type: "deviceMac", value: deviceMac, isActive: true });
    }

    const blocked = await BlockedEntity.findOne({ $or: query });

    if (blocked) {
      return res.status(403).json({
        success: false,
        isBlocked: true,
        message: `ACCESS DENIED: Your ${blocked.type === "deviceMac" ? "Device (MAC: " + blocked.value + ")" : "IP Address (" + blocked.value + ")"} has been permanently blocked by Food Garden Security System.`,
        blockDetails: {
          type: blocked.type,
          value: blocked.value,
          reason: blocked.reason,
          blockedAt: blocked.createdAt,
        },
      });
    }

    next();
  } catch (error) {
    // If DB check fails, don't crash the request
    next();
  }
};

module.exports = {
  checkSecurityBlock,
};
