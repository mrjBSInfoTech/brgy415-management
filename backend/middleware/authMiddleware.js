import jwt from "jsonwebtoken";
import db from "../database/db.js";
import { clearAuthCookieOptions, parseCookies } from "../utils/authCookies.js";

const isPublicEndpoint = (req) => {
  const url = String(req.originalUrl || req.baseUrl || "").split("?")[0];
  if (url.startsWith("/api/login")) {
    return true;
  }
  if (url === "/api/concerns" && req.method === "POST") {
    return true;
  }
  return false;
};

const extractBearerToken = (req) => {
  const authHeader = req.headers?.authorization || req.headers?.Authorization;
  if (!authHeader || typeof authHeader !== "string") return null;
  const parts = authHeader.trim().split(/\s+/);
  if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
    const candidate = parts[1].trim();
    if (candidate && candidate !== "null" && candidate !== "undefined") {
      return candidate;
    }
  }
  return null;
};

export const authenticateToken = (req, res, next) => {
  const cookies = req.cookies || parseCookies(req);
  const publicRoute = isPublicEndpoint(req);
  const cookieName = publicRoute ? "public_token" : "private_token";

  const bearerToken = extractBearerToken(req);
  const token = bearerToken || cookies[cookieName];

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET,
    { algorithms: ["HS256"] },
    (err, user) => {
      if (err) {
        if (typeof res.clearCookie === "function") {
          res.clearCookie(cookieName, clearAuthCookieOptions());
        }
        return res.status(401).json({ message: "Invalid or expired token." });
      }

      if (publicRoute) {
        const userId = user.user_id || user.id;
        if (!userId) {
          return res.status(403).json({ message: "Unable to identify citizen account." });
        }

        db.query(
          "SELECT user_id, email, type, status FROM user_account WHERE user_id = ? LIMIT 1",
          [userId],
          (dbErr, results) => {
            if (dbErr) {
              return res.status(500).json({ message: "Unable to verify citizen account status." });
            }
            const current = results?.[0];
            if (!current) {
              if (typeof res.clearCookie === "function") {
                res.clearCookie("public_token", clearAuthCookieOptions());
              }
              return res.status(401).json({ message: "Account no longer exists." });
            }

            if (String(current.status || "").toLowerCase() !== "verified") {
              if (typeof res.clearCookie === "function") {
                res.clearCookie("public_token", clearAuthCookieOptions());
              }
              return res.status(403).json({ message: "Your account has not been verified yet." });
            }

            req.user = {
              ...user,
              id: current.user_id,
              user_id: current.user_id,
              email: current.email,
              type: current.type,
              status: current.status,
              role: "public",
            };
            next();
          }
        );
        return;
      }

      // Private (Official / Staff / Admin) Route Verification
      if (user.role === "public" || (!user.account_type && !user.official_account_id && user.email)) {
        return res.status(403).json({ message: "Access denied. Official privileges required." });
      }

      const officialId = user.official_account_id || user.id;
      if (!officialId) {
        return res.status(403).json({ message: "Unable to identify official account." });
      }

      db.query(
        "SELECT official_account_id, username, account_type, password_changed FROM official_account WHERE official_account_id = ? LIMIT 1",
        [officialId],
        (dbErr, results) => {
          if (dbErr) {
            return res.status(500).json({ message: "Unable to verify official account status." });
          }
          const current = results?.[0];
          if (!current) {
            if (typeof res.clearCookie === "function") {
              res.clearCookie("private_token", clearAuthCookieOptions());
            }
            return res.status(401).json({ message: "Official account no longer exists." });
          }

          const tokenPasswordChanged = Number(user.password_changed ?? 0);
          const currentPasswordChanged = Number(current.password_changed ?? 0);
          if (
            user.password_changed !== undefined &&
            tokenPasswordChanged !== currentPasswordChanged
          ) {
            if (typeof res.clearCookie === "function") {
              res.clearCookie("private_token", clearAuthCookieOptions());
            }
            return res.status(401).json({
              message: "Session has expired due to a password change or logout. Please log in again.",
            });
          }

          req.user = {
            ...user,
            id: current.official_account_id,
            official_account_id: current.official_account_id,
            username: current.username,
            account_type: current.account_type,
            role: "private",
          };
          next();
        }
      );
    }
  );
};
