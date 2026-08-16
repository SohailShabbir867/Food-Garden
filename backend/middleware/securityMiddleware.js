// backend/middleware/securityMiddleware.js
const BlockedEntity = require("../models/BlockedEntity");
const { getClientIp } = require("../utils/geoIpHelper");

/**
 * Gatekeeper middleware that verifies the incoming IP is not blocked.
 * Browser-provided device fingerprints are not trustworthy security identifiers.
 */
const checkSecurityBlock = async (req, res, next) => {
  try {
    const ip = getClientIp(req);
    const blocked = await BlockedEntity.findOne({ type: "ip", value: ip, isActive: true });

    if (blocked) {
      return res.status(403).json({
        success: false,
        isBlocked: true,
        message: "ACCESS DENIED: This network address has been blocked by Food Garden Security System.",
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
