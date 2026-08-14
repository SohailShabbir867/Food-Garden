// backend/controllers/securityController.js
const SecurityAlert = require("../models/SecurityAlert");
const BlockedEntity = require("../models/BlockedEntity");

/**
 * GET /api/admin/security/stats
 * Dashboard metrics for security threats and alerts.
 */
const getSecurityStats = async (req, res, next) => {
  try {
    const totalAlerts = await SecurityAlert.countDocuments();
    const activeAlerts = await SecurityAlert.countDocuments({ status: "active" });
    const lockedAccounts = await SecurityAlert.countDocuments({
      status: "locked",
      lockoutUntil: { $gt: new Date() },
    });
    const criticalThreats = await SecurityAlert.countDocuments({ severity: "critical" });
    const blockedCount = await BlockedEntity.countDocuments({ isActive: true });

    // Recent 10 alerts
    const recentAlerts = await SecurityAlert.find()
      .sort({ updatedAt: -1 })
      .limit(10);

    res.json({
      success: true,
      stats: {
        totalAlerts,
        activeAlerts,
        lockedAccounts,
        criticalThreats,
        blockedEntities: blockedCount,
      },
      recentAlerts,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/security/alerts
 * List and filter security alerts with pagination.
 */
const getSecurityAlerts = async (req, res, next) => {
  try {
    const { status, severity, search, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (status && status !== "all") {
      filter.status = status;
    }
    if (severity && severity !== "all") {
      filter.severity = severity;
    }
    if (search) {
      filter.$or = [
        { email: { $regex: search, $options: "i" } },
        { ip: { $regex: search, $options: "i" } },
        { deviceMac: { $regex: search, $options: "i" } },
        { "location.city": { $regex: search, $options: "i" } },
        { "location.country": { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [alerts, total] = await Promise.all([
      SecurityAlert.find(filter)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      SecurityAlert.countDocuments(filter),
    ]);

    res.json({
      success: true,
      alerts,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/security/blocked
 * List all blocked IPs and Devices.
 */
const getBlockedEntities = async (req, res, next) => {
  try {
    const blocked = await BlockedEntity.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, blocked });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/admin/security/block
 * Manually block an IP or Device MAC.
 */
const blockEntity = async (req, res, next) => {
  try {
    const { type, value, reason } = req.body;

    if (!type || !value) {
      return res.status(400).json({ success: false, message: "Type and Value are required." });
    }

    const entity = await BlockedEntity.findOneAndUpdate(
      { type, value },
      {
        type,
        value,
        reason: reason || "Manually blocked by Administrator",
        blockedBy: req.user?.name || "Admin",
        isActive: true,
      },
      { upsert: true, new: true }
    );

    // Update matching security alerts
    const alertQuery = type === "ip" ? { ip: value } : { deviceMac: value };
    await SecurityAlert.updateMany(alertQuery, { status: "blocked", severity: "critical" });

    res.json({
      success: true,
      message: `Successfully blocked ${type.toUpperCase()}: ${value}`,
      entity,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/admin/security/unblock
 * Unblock an IP or Device MAC.
 */
const unblockEntity = async (req, res, next) => {
  try {
    const { type, value } = req.body;

    if (!type || !value) {
      return res.status(400).json({ success: false, message: "Type and Value are required." });
    }

    await BlockedEntity.deleteOne({ type, value });

    // Also unblock matching alerts and clear lockouts
    const alertQuery = type === "ip" ? { ip: value } : { deviceMac: value };
    await SecurityAlert.updateMany(alertQuery, {
      status: "resolved",
      lockoutUntil: null,
      attemptCount: 0,
    });

    res.json({
      success: true,
      message: `Successfully unblocked ${type.toUpperCase()}: ${value}`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/admin/security/alerts/:id/resolve
 * Mark a security alert as resolved.
 */
const resolveAlert = async (req, res, next) => {
  try {
    const alert = await SecurityAlert.findByIdAndUpdate(
      req.params.id,
      { status: "resolved", lockoutUntil: null, attemptCount: 0 },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({ success: false, message: "Alert not found" });
    }

    res.json({ success: true, message: "Alert resolved successfully", alert });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/admin/security/alerts/:id
 * Delete an alert history record.
 */
const deleteAlert = async (req, res, next) => {
  try {
    const alert = await SecurityAlert.findByIdAndDelete(req.params.id);
    if (!alert) {
      return res.status(404).json({ success: false, message: "Alert not found" });
    }
    res.json({ success: true, message: "Alert deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSecurityStats,
  getSecurityAlerts,
  getBlockedEntities,
  blockEntity,
  unblockEntity,
  resolveAlert,
  deleteAlert,
};
