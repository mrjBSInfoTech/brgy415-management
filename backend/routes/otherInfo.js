import express from "express";
import db from "../database/db.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

const sanitizeUrl = (value) => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  // Block dangerous pseudo-protocols (XSS prevention)
  if (/^(javascript|data|vbscript):/i.test(trimmed)) {
    return null;
  }
  // Enforce http/https
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  // If user entered e.g. facebook.com/... or www.facebook.com/..., default to https://
  if (/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return null;
};

const normalizeText = (value) => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed || null;
};

router.get("/", (req, res) => {
  const sql = `
    SELECT *
    FROM footer
    WHERE info_id = (
      SELECT info_id
      FROM brgy_info
      ORDER BY info_id DESC
      LIMIT 1
    )
    LIMIT 1
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results && results.length > 0) {
      return res.json(results[0]);
    }
    db.query("SELECT * FROM footer LIMIT 1", (fallbackErr, fallbackResults) => {
      if (fallbackErr) return res.status(500).json({ error: fallbackErr.message });
      res.json(fallbackResults[0] || null);
    });
  });
});

router.put("/:id", authenticateToken, (req, res) => {
  // 1. Role-Based Access Control: ensure caller has official Admin/Staff role
  if (!["Admin", "Staff"].includes(req.user?.account_type)) {
    return res.status(403).json({ error: "Access denied. Admin or Staff privileges required." });
  }

  const { id } = req.params;
  const {
    email,
    tp_number,
    phone_number,
    facebook_link,
    instagram_link,
    x_link,
    address,
  } = req.body;

  // 2. Reject dangerous URL schemes
  const rawFacebook = typeof facebook_link === "string" ? facebook_link.trim() : "";
  const rawInstagram = typeof instagram_link === "string" ? instagram_link.trim() : "";
  const rawX = typeof x_link === "string" ? x_link.trim() : "";

  if (
    /^(javascript|data|vbscript):/i.test(rawFacebook) ||
    /^(javascript|data|vbscript):/i.test(rawInstagram) ||
    /^(javascript|data|vbscript):/i.test(rawX)
  ) {
    return res.status(400).json({ error: "Invalid URL scheme detected. Dangerous protocols are not allowed." });
  }

  // 3. Sanitize and format valid URLs
  const sanitizedFacebook = sanitizeUrl(facebook_link);
  const sanitizedInstagram = sanitizeUrl(instagram_link);
  const sanitizedX = sanitizeUrl(x_link);

  if (!sanitizedFacebook && !sanitizedInstagram && !sanitizedX) {
    return res.status(400).json({ error: "At least one valid social media link is required (e.g. https://facebook.com/yourpage)." });
  }

  const sql = `
    UPDATE footer
    SET email = ?,
        tp_number = ?,
        phone_number = ?,
        facebook_link = ?,
        instagram_link = ?,
        x_link = ?,
        address = ?
    WHERE info_id = ?
  `;

  db.query(
    sql,
    [
      normalizeText(email),
      normalizeText(tp_number),
      normalizeText(phone_number),
      sanitizedFacebook,
      sanitizedInstagram,
      sanitizedX,
      normalizeText(address),
      id,
    ],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Other info not found" });
      }
      res.json({ message: "Other info updated successfully" });
    }
  );
});

export default router;
