import express from "express";
import db from "../database/db.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

const normalizeLink = (value) => {
  if (typeof value !== "string") return "";
  return value.trim();
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

  const normalizedFacebook = normalizeLink(facebook_link);
  const normalizedInstagram = normalizeLink(instagram_link);
  const normalizedX = normalizeLink(x_link);

  if (!normalizedFacebook && !normalizedInstagram && !normalizedX) {
    return res.status(400).json({ error: "At least one social media link is required" });
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
      normalizeLink(email) || null,
      normalizeLink(tp_number) || null,
      normalizeLink(phone_number) || null,
      normalizedFacebook || null,
      normalizedInstagram || null,
      normalizedX || null,
      normalizeLink(address) || null,
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
