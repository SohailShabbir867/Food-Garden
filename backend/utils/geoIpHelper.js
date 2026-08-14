// backend/utils/geoIpHelper.js

/**
 * Extracts the real client IP address from express request headers or socket.
 */
const getClientIp = (req) => {
  let ip =
    req.headers["cf-connecting-ip"] ||
    req.headers["x-real-ip"] ||
    (req.headers["x-forwarded-for"] ? req.headers["x-forwarded-for"].split(",")[0].trim() : null) ||
    req.socket?.remoteAddress ||
    req.ip ||
    "127.0.0.1";

  if (ip.startsWith("::ffff:")) {
    ip = ip.substring(7);
  }
  if (ip === "::1" || ip === "0:0:0:0:0:0:0:1") {
    ip = "127.0.0.1";
  }
  return ip;
};

/**
 * Resolves IP geolocation information using public Geo-IP APIs with local fallback.
 */
const lookupGeoLocation = async (ip) => {
  const isLocal =
    !ip ||
    ip === "127.0.0.1" ||
    ip === "localhost" ||
    ip.startsWith("192.168.") ||
    ip.startsWith("10.") ||
    ip.startsWith("172.16.");

  if (isLocal) {
    return {
      country: "Local Network",
      countryCode: "PK",
      city: "Localhost",
      region: "Internal Dev / Subnet",
      lat: 31.5204,
      lon: 74.3587,
      isp: "Local Loopback / Intranet",
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,regionName,city,lat,lon,isp`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.status === "success") {
        return {
          country: data.country || "Unknown",
          countryCode: data.countryCode || "UN",
          city: data.city || "Unknown",
          region: data.regionName || "Unknown",
          lat: data.lat || 0,
          lon: data.lon || 0,
          isp: data.isp || "Unknown ISP",
        };
      }
    }
  } catch (err) {
    // Graceful fallback on network timeout/offline
  }

  return {
    country: "Unknown Location",
    countryCode: "UN",
    city: "Unknown City",
    region: "Unknown Region",
    lat: 0,
    lon: 0,
    isp: "Unknown ISP",
  };
};

module.exports = {
  getClientIp,
  lookupGeoLocation,
};
