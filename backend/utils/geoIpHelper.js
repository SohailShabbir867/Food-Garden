// backend/utils/geoIpHelper.js

/**
 * Gets the client IP as determined by Express. Forwarded headers are honoured
 * only when server.js has explicitly configured trusted reverse proxies.
 */
const getClientIp = (req) => {
  let ip = req.ip || req.socket?.remoteAddress || "127.0.0.1";

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
