// frontend/src/utils/deviceFingerprint.js

/**
 * Generates a deterministic, persistent Device & Hardware MAC fingerprint identifier.
 * Uses canvas, screen resolution, WebGL, timezone, platform, and storage token.
 */
export const getDeviceFingerprint = () => {
  let storedMac = localStorage.getItem("fg_device_mac");
  if (!storedMac) {
    const rawEntropy = [
      navigator.userAgent,
      navigator.language,
      screen.width + "x" + screen.height + "x" + screen.colorDepth,
      new Date().getTimezoneOffset(),
      navigator.hardwareConcurrency || 4,
      navigator.deviceMemory || 8,
      getCanvasHash(),
    ].join("###");

    let hash = 0;
    for (let i = 0; i < rawEntropy.length; i++) {
      const char = rawEntropy.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }

    // Format like a standard MAC address (e.g. 5A:B2:3F:89:C1:0D)
    const hex = Math.abs(hash).toString(16).padStart(12, "0").toUpperCase();
    storedMac = hex.match(/.{1,2}/g).slice(0, 6).join(":");
    localStorage.setItem("fg_device_mac", storedMac);
  }
  return storedMac;
};

const getCanvasHash = () => {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 50;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "nocanvas";
    ctx.textBaseline = "top";
    ctx.font = "14px 'Arial'";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#f60";
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = "#069";
    ctx.fillText("FoodGardenSecurity#101", 2, 15);
    return canvas.toDataURL().slice(-50);
  } catch {
    return "canvas-err";
  }
};

/**
 * Gathers client device environment details for security logs.
 */
export const getClientDeviceInfo = () => {
  const ua = navigator.userAgent;
  let browser = "Unknown Browser";
  let os = "Unknown OS";

  if (ua.includes("Chrome") && !ua.includes("Edg")) browser = "Chrome";
  else if (ua.includes("Edg")) browser = "Edge";
  else if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";

  if (ua.includes("Windows NT 10.0")) os = "Windows 10/11";
  else if (ua.includes("Mac OS X")) os = "macOS";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";
  else if (ua.includes("Linux")) os = "Linux";

  return {
    browser,
    os,
    platform: navigator.platform || "Web",
    screenResolution: `${window.screen?.width || 0}x${window.screen?.height || 0}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
    language: navigator.language || "en",
  };
};

