// backend/utils/logger.js

const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  gray: "\x1b[90m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  bgRed: "\x1b[41m",
};

const getTimestamp = () => {
  const now = new Date();
  return now.toISOString().replace("T", " ").substring(0, 19);
};

const formatStatus = (statusCode) => {
  const code = Number(statusCode);
  if (code >= 500) return `${colors.bgRed}${colors.white}${colors.bright} ${code} ${colors.reset}`;
  if (code >= 400) return `${colors.yellow}${colors.bright}${code}${colors.reset}`;
  if (code >= 300) return `${colors.cyan}${colors.bright}${code}${colors.reset}`;
  if (code >= 200) return `${colors.green}${colors.bright}${code}${colors.reset}`;
  return `${colors.white}${code}${colors.reset}`;
};

const formatMethod = (method) => {
  const m = (method || "GET").toUpperCase();
  switch (m) {
    case "GET":
      return `${colors.green}${colors.bright}${m}${colors.reset}`;
    case "POST":
      return `${colors.yellow}${colors.bright}${m}${colors.reset}`;
    case "PUT":
    case "PATCH":
      return `${colors.blue}${colors.bright}${m}${colors.reset}`;
    case "DELETE":
      return `${colors.red}${colors.bright}${m}${colors.reset}`;
    default:
      return `${colors.magenta}${colors.bright}${m}${colors.reset}`;
  }
};

const logger = {
  info: (message, meta) => {
    const metaStr = meta ? ` ${colors.dim}${JSON.stringify(meta)}${colors.reset}` : "";
    console.log(`${colors.gray}[${getTimestamp()}]${colors.reset} ${colors.blue}[INFO]${colors.reset} ${message}${metaStr}`);
  },

  warn: (message, meta) => {
    const metaStr = meta ? ` ${colors.dim}${JSON.stringify(meta)}${colors.reset}` : "";
    console.warn(`${colors.gray}[${getTimestamp()}]${colors.reset} ${colors.yellow}[WARN]${colors.reset} ${message}${metaStr}`);
  },

  error: (message, error, meta) => {
    const metaStr = meta ? ` ${colors.dim}${JSON.stringify(meta)}${colors.reset}` : "";
    console.error(`${colors.gray}[${getTimestamp()}]${colors.reset} ${colors.red}${colors.bright}[ERROR]${colors.reset} ${message}${metaStr}`);
    if (error && error.stack) {
      console.error(`${colors.red}${colors.dim}${error.stack}${colors.reset}`);
    } else if (error) {
      console.error(`${colors.red}${colors.dim}${error.message || error}${colors.reset}`);
    }
  },

  debug: (message, meta) => {
    if (process.env.NODE_ENV !== "production") {
      const metaStr = meta ? ` ${colors.dim}${JSON.stringify(meta)}${colors.reset}` : "";
      console.log(`${colors.gray}[${getTimestamp()}]${colors.reset} ${colors.magenta}[DEBUG]${colors.reset} ${message}${metaStr}`);
    }
  },

  http: ({ method, url, status, responseTime, user, ip, contentLength }) => {
    const timeStr = responseTime ? `${colors.dim}${responseTime}ms${colors.reset}` : "";
    const sizeStr = contentLength ? `${colors.dim}${contentLength}b${colors.reset}` : "";
    const userStr = user ? `${colors.cyan}[User: ${user.id} (${user.role})]${colors.reset}` : `${colors.gray}[Anon]${colors.reset}`;
    const ipStr = ip ? `${colors.gray}${ip}${colors.reset}` : "";

    const parts = [
      `${colors.gray}[${getTimestamp()}]${colors.reset}`,
      `${colors.magenta}[HTTP]${colors.reset}`,
      formatMethod(method),
      `${colors.bright}${url}${colors.reset}`,
      formatStatus(status),
      timeStr,
      sizeStr,
      userStr,
      ipStr,
    ].filter(Boolean);

    console.log(parts.join(" "));
  },
};

module.exports = logger;
