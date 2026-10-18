import express from "express";
import db from "../database/db.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get absolute path for uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "..", "uploads", "uploadReport");

// ✅ Ensure upload folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Sanitize filename
    const fileName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
    const uniqueName = `${Date.now()}-${fileName}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// 🟢 Get all reports
router.get("/", authenticateToken, (req, res) => {
  const sql = `
    SELECT 
      r.report_id,
      r.official_id,
      r.message_id,
      r.report,
      r.attachment,
      r.date_created,
      o.first_name,
      o.middle_name,
      o.last_name,
      o.position,
      o.image
    FROM report r
    LEFT JOIN official o ON (r.official_id = o.official_id OR r.official_id = o.official_account_id)
    ORDER BY r.date_created DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 🔍 Get single report by ID
router.get("/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT 
      report_id,
      official_id,
      message_id,
      report,
      attachment,
      date_created,
      o.first_name,
      o.middle_name,
      o.last_name,
      o.position,
      o.image
    FROM report r
    LEFT JOIN official o ON (r.official_id = o.official_id OR r.official_id = o.official_account_id)
    WHERE report_id = ?
  `;
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: "Report not found" });
    res.json(results[0]);
  });
});

// ➕ Add new report (Send report)
router.post("/", authenticateToken, upload.single("attachment"), (req, res) => {
  const { official_id, message_id, report } = req.body;
  const attachment = req.file ? req.file.filename : null;
  const officialId = official_id || req.user?.official_account_id || req.user?.id || null;

  if (!report) {
    return res.status(400).json({ error: "Please fill all required fields." });
  }

  const sql = `
    INSERT INTO report 
    (official_id, message_id, report, attachment, date_created) 
    VALUES (?, ?, ?, ?, NOW())
  `;

  db.query(
    sql,
    [officialId, message_id || null, report, attachment],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "✅ Report added successfully", id: result.insertId });
    }
  );
});

// ✏️ Update report
router.put("/:id", authenticateToken, upload.single("attachment"), (req, res) => {
  const { id } = req.params;
  const { official_id, message_id, report } = req.body;
  const attachment = req.file ? req.file.filename : req.body.attachment;

  if (!report) {
    return res.status(400).json({ error: "Please fill all required fields." });
  }

  // If a new file is uploaded, remove the old file from storage
  if (req.file) {
    db.query("SELECT attachment FROM report WHERE report_id = ?", [id], (err, results) => {
      if (results && results[0]?.attachment) {
        const oldFilePath = path.join(uploadDir, results[0].attachment);
        if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);
      }
    });
  }

  const sql = `
    UPDATE report 
    SET official_id = ?, message_id = ?, report = ?, attachment = ?
    WHERE report_id = ?
  `;

  db.query(
    sql,
    [official_id || null, message_id || null, report, attachment || null, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "✅ Report updated successfully" });
    }
  );
});

// ❌ Delete report
router.delete("/:id", authenticateToken, (req, res) => {
  const { id } = req.params;

  // Get attachment filename first to delete the file from folder
  db.query("SELECT attachment FROM report WHERE report_id = ?", [id], (err, results) => {
    if (results && results[0]?.attachment) {
      const filePath = path.join(uploadDir, results[0].attachment);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    db.query("DELETE FROM report WHERE report_id = ?", [id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "✅ Report deleted successfully" });
    });
  });
});

export default router;
