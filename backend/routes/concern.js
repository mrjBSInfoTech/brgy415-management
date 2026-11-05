import express from "express";
import dotenv from "dotenv";
import db from "../database/db.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { classifyMessageWithAI } from "../services/messageClassifier.js";
import { alarm } from "../services/alarm.js";

import { detectMessageTripping } from "../services/messageValidation.js";
export { detectMessageTripping } from "../services/messageValidation.js";

dotenv.config();

const router = express.Router();

// Legacy local urgency helper; submissions require contextual AI validation.
export const classifyMessageLocally = (text) => {
  const normalized = (text || "").toLowerCase().trim();

  // Look for extreme violence/life threats (Even with panic typos like nagpapatayan/mamatay)
  if (/\b(?:patay|mamatay|nagpapatayan|saksak|nagsasaksakan|baril|binabaril|murder|kill|hostage|paksak)\b/.test(normalized)) {
    return { urgency: "High", type: "Emergency", valid: true, reason: "Critical danger to life or active violent altercation detected." };
  }

  if (/\b(?:sunog|fire|nasusunog|nagsusunog)\b/.test(normalized)) {
    return { urgency: "High", type: "Emergency", valid: true, reason: "Active fire structural danger." };
  }

  if (/\b(?:magnanakaw|thief|nangnakaw|nanakaw|holdap|holdaper|pulis|police|manyak|bastos|manyakis)\b/.test(normalized)) {
    return { urgency: "Medium", type: "Dispute", valid: true, reason: "Theft, harassment, or immediate perimeter safety breach." };
  }

  if (/\b(?:streetlight|basura|trash|drainage|canal|kable|wire|videoke|ingay|bardagulan|lasing|lasingero|sira|damaged|broken|pundido|kalat|kalat-kalat|kalsada|street|roads|roads?\b|magulo)\b/.test(normalized)) {
    return { urgency: "Medium", type: "Dispute", valid: true, reason: "Active public nuisance or physical structural hazard." };
  }

  if (/\b(?:utang|debt|bayad|payment|pay|pautang|kulang|kulang pa|hindi pa|di pa binayaran)\b/.test(normalized)) {
    return { urgency: "Low", type: "General", valid: true, reason: "A legitimate neighborhood or personal accountability report was detected." };
  }

  return { urgency: "Low", type: "General", valid: true, reason: "Legitimate low-urgency neighborhood query or administrative remark." };
};

const triggerEspAlert = async (urgency) => {
  if (!["High", "Medium"].includes(urgency)) return null;
  try {
    const delivery = await alarm.sendAlert(urgency);
    if (!["confirmed", "sent"].includes(delivery.status)) {
      console.warn("Concern saved; alarm delivery:", delivery.status);
    }
    return delivery;
  } catch (error) {
    console.error("Concern saved; alarm delivery failed:", error.message);
    return { status: "unavailable", message: "Concern saved, but the alarm could not be sent." };
  }
};

// 🟢 GET all messages
router.get("/", authenticateToken, (req, res) => {
  const sql = `SELECT 
    m.message_id, 
    m.user_id, 
    m.message,
    m.message_type,
    m.message_urgency,
    m.status,
    m.date_posted,
    u.first_name,
    u.last_name,
    u.type
  FROM message m
  LEFT JOIN user_account u ON m.user_id = u.user_id
  ORDER BY m.date_posted DESC`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
});

// 🔍 GET single message by ID
router.get("/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM message WHERE message_id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    if (results.length === 0)
      return res.status(404).json({ message: "Message not found" });
    res.json(results[0]);
  });
});

// ➕ POST: Process and Triage Inbound Submissions
router.post("/", authenticateToken, async (req, res) => {
  const user_id = req.user.id;
  const { message, message_type } = req.body;

  if (typeof message !== "string" || !message.trim() || !message_type) {
    return res
      .status(400)
      .json({ message: "Please fill all required fields." });
  }

  // Daily limit temporarily disabled for testing.
  // To restore it, remove this block's comment markers and those around its closing callback below.
  /*
  // Anti-Spam Check - Allow only ONE message per user per day
  const dailyCheckSql = `
    SELECT message_id 
    FROM message 
    WHERE user_id = ? AND DATE(date_posted) = CURDATE() 
    LIMIT 1
  `;

  db.query(dailyCheckSql, [user_id], async (err, results) => {
    if (err) {
      console.error("Database limit check error:", err);
      return res.status(500).json({ message: "Database check failed." });
    }

    // If the user already submitted a concern today, reject the submission
    if (results.length > 0) {
      return res.status(400).json({
        message: "Daily limit reached. You can only submit one concern per day. Please try again tomorrow.",
      });
    }

  */

    // Local Regex Tripping Interceptor
    const localCheck = detectMessageTripping(message);
    if (localCheck && !localCheck.valid) {
      return res.status(400).json({
        message: "Message rejected: Out-of-topic, joke, or spam detected.",
        reason: localCheck.reason,
      });
    }

    // AI Context Evaluation
    let classification;
    try {
      classification = await classifyMessageWithAI(message);
    } catch {
      return res.status(503).json({
        message: "Message could not be sent because the validation service is unavailable. Please try again later.",
      });
    }

    if (!classification.valid) {
      return res.status(400).json({
        message: "Message rejected: Out-of-topic, joke, or spam detected."
      });
    }

    const urgency = classification.urgency;
    const type = classification.type;
    const status = "Pending";

    // Insert Into Database
    const insertSql = `
      INSERT INTO message (user_id, message, message_type, message_urgency, status) 
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
      insertSql,
      [user_id || null, message, message_type, urgency, status],
      async (err, result) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ message: err.message });
        }

        const alertDelivery = await triggerEspAlert(urgency);

        res.json({
          message: "Message categorized and sent",
          id: result.insertId,
          alertDelivery,
          classification: { 
            type, 
            urgency, 
            valid: classification.valid
          },
        });
      }
    );
  /* Daily-limit callback closing: uncomment together with the daily check above.
  });
  */
  });

// ✏️ UPDATE: Change Status
router.put("/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status)
    return res.status(400).json({ message: "Status update is required." });

  const sql = "UPDATE message SET status = ? WHERE message_id = ?";

  db.query(sql, [status, id], (err) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: `Message status updated to ${status}` });
  });
});

// ✏️ PUT: Change Status for Multiple Messages
router.put("/bulk/status", authenticateToken, (req, res) => {
  const { ids, status } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0 || !status) {
    return res.status(400).json({ message: "An array of message IDs and status are required." });
  }

  const sql = "UPDATE message SET status = ? WHERE message_id IN (?)";

  db.query(sql, [status, ids], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: `${result.affectedRows} concerns updated to ${status}` });
  });
});

// ❌ DELETE Message
router.delete("/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM message WHERE message_id = ?";

  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: "Message deleted successfully" });
  });
});

// ❌ Delete Multiple Messages
router.post("/bulk/delete", authenticateToken, (req, res) => {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: "An array of message IDs is required." });
  }

  const sql = "DELETE FROM message WHERE message_id IN (?)";

  db.query(sql, [ids], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: `${result.affectedRows} concerns deleted successfully` });
  });
});

export default router;
