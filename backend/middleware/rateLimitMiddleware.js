const { getClientIp } = require("../utils/geoIpHelper");

// Per-process throttling for sensitive, unauthenticated endpoints. Deployments
// that run multiple API instances should replace this store with Redis.
const buckets = new Map();

setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}, 60_000).unref();

const createRateLimiter = ({ name, windowMs, max, keyFromRequest }) => (req, res, next) => {
  const now = Date.now();
  const key = `${name}:${keyFromRequest(req)}`;
  const current = buckets.get(key);
  const bucket = !current || current.resetAt <= now
    ? { count: 0, resetAt: now + windowMs }
    : current;

  bucket.count += 1;
  buckets.set(key, bucket);

  if (bucket.count > max) {
    const retryAfter = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
    res.set("Retry-After", String(retryAfter));
    return res.status(429).json({
      message: "Too many verification requests. Please wait before trying again.",
      retryAfter,
    });
  }

  next();
};

const otpKey = (req) => {
  const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "unknown";
  return `${getClientIp(req)}:${email}`;
};

const otpVerificationLimiter = createRateLimiter({
  name: "otp-verify",
  windowMs: 15 * 60 * 1000,
  max: 5,
  keyFromRequest: otpKey,
});

const otpResendLimiter = createRateLimiter({
  name: "otp-resend",
  windowMs: 15 * 60 * 1000,
  max: 3,
  keyFromRequest: otpKey,
});

module.exports = { otpVerificationLimiter, otpResendLimiter };
