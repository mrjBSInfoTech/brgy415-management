const getCookieSameSite = () => {
  if (process.env.NODE_ENV !== "production") return "lax";
  const configured = String(process.env.COOKIE_SAME_SITE || "none").trim().toLowerCase();
  return ["strict", "lax", "none"].includes(configured) ? configured : "none";
};

export const getAuthCookieOptions = (days = 7) => {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: getCookieSameSite(),
    path: "/",
    maxAge: days * 24 * 60 * 60 * 1000,
  };
};

export const clearAuthCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: getCookieSameSite(),
    path: "/",
  };
};

export const parseCookies = (req) => {
  const cookieHeader = req.headers?.cookie;
  const cookies = {};
  if (cookieHeader) {
    const pairs = cookieHeader.split(";");
    for (const pair of pairs) {
      const idx = pair.indexOf("=");
      if (idx !== -1) {
        const key = pair.substring(0, idx).trim();
        const val = pair.substring(idx + 1).trim();
        if (key) {
          try {
            cookies[key] = decodeURIComponent(val);
          } catch {
            cookies[key] = val;
          }
        }
      }
    }
  }
  return cookies;
};

export const cookieMiddleware = (req, res, next) => {
  req.cookies = parseCookies(req);
  next();
};
