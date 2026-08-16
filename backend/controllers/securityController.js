// backend/controllers/securityController.js
const SecurityAlert = require("../models/SecurityAlert");
const BlockedEntity = require("../models/BlockedEntity");

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const allowedStatuses = new Set(["active", "locked", "blocked", "resolved", "all"]);
const allowedSeverities = new Set(["low", "medium", "high", "critical", "all"]);

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

    if (status && !allowedStatuses.has(status)) {
      return res.status(400).json({ success: false, message: "Invalid alert status." });
    }
    if (severity && !allowedSeverities.has(severity)) {
      return res.status(400).json({ success: false, message: "Invalid alert severity." });
    }
    if (status && status !== "all") {
      filter.status = status;
    }
    if (severity && severity !== "all") {
      filter.severity = severity;
    }
    if (typeof search === "string" && search.trim()) {
      const escapedSearch = escapeRegex(search.trim().slice(0, 100));
      filter.$or = [
        { email: { $regex: escapedSearch, $options: "i" } },
        { ip: { $regex: escapedSearch, $options: "i" } },
        { "location.city": { $regex: escapedSearch, $options: "i" } },
        { "location.country": { $regex: escapedSearch, $options: "i" } },
      ];
    }

    const safePage = Math.max(1, Math.min(Number.parseInt(page, 10) || 1, 10_000));
    const safeLimit = Math.max(1, Math.min(Number.parseInt(limit, 10) || 20, 100));
    const skip = (safePage - 1) * safeLimit;
    const [alerts, total] = await Promise.all([
      SecurityAlert.find(filter)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(safeLimit),
      SecurityAlert.countDocuments(filter),
    ]);

    res.json({
      success: true,
      alerts,
      pagination: {
        total,
        page: safePage,
        pages: Math.ceil(total / safeLimit),
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

    if (type !== "ip" || typeof value !== "string" || !value.trim()) {
      return res.status(400).json({ success: false, message: "A valid IP address is required." });
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
    const alertQuery = { ip: value };
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

    if (type !== "ip" || typeof value !== "string" || !value.trim()) {
      return res.status(400).json({ success: false, message: "A valid IP address is required." });
    }

    await BlockedEntity.deleteOne({ type, value });

    // Also unblock matching alerts and clear lockouts
    const alertQuery = { ip: value };
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
