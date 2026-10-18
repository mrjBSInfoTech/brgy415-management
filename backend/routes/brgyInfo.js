import express from "express";
import db from "../database/db.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const router = express.Router();

// Get absolute path for uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "..", "uploads", "uploadOfficial");

// Ensure upload folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const originalName = path.parse(file.originalname).name;
    const ext = path.extname(file.originalname);
    const safeName = originalName.replace(/[^a-zA-Z0-9_-]/g, "_");

    let filename = `${safeName}${ext}`;
    let counter = 1;

    while (fs.existsSync(path.join(uploadDir, filename))) {
      filename = `${safeName}_${counter}${ext}`;
      counter++;
    }

    cb(null, filename);
  },
});

const upload = multer({ storage });

async function removeUploadedLogo(filename) {
  if (!filename || filename === "BarangayIcon.png") return;
  const target = path.resolve(uploadDir, filename);
  if (path.dirname(target) !== uploadDir) return;
  try {
    await fs.promises.unlink(target);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("Failed to remove barangay logo:", error);
    }
  }
}

// Get Barangay Info
router.get("/", (req, res) => {
  const sql = `SELECT * FROM brgy_info LIMIT 1`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results.length > 0 ? results[0] : null);
  });
});

// Update Barangay Info
router.put("/:id", upload.single("brgy_logo"), (req, res) => {
  const { id } = req.params;
  const { brgy_name, mission, vision, about, color_scheme } = req.body;
  db.query(
    "SELECT brgy_logo FROM brgy_info WHERE info_id = ?",
    [id],
    async (err, rows) => {
      if (err) {
        await removeUploadedLogo(req.file?.filename);
        return res.status(500).json({ error: err.message });
      }
      if (!rows.length) {
        await removeUploadedLogo(req.file?.filename);
        return res.status(404).json({ message: "Barangay info not found" });
      }

      const previousLogo = rows[0].brgy_logo;
      const brgy_logo = req.file ? req.file.filename : previousLogo;
      db.query(
        `UPDATE brgy_info
         SET brgy_name = ?, mission = ?, vision = ?, brgy_logo = ?, about = ?, color_scheme = ?
         WHERE info_id = ? AND brgy_logo <=> ?`,
        [brgy_name, mission, vision, brgy_logo, about, color_scheme, id, previousLogo],
        async (updateError, result) => {
          if (updateError || result.affectedRows === 0) {
            await removeUploadedLogo(req.file?.filename);
            return res.status(updateError ? 500 : 409).json({
              error: updateError?.message || "Barangay info changed. Please reload and try again.",
            });
          }
          if (req.file && previousLogo !== brgy_logo) {
            await removeUploadedLogo(previousLogo);
          }
          res.json({ message: "Barangay info updated successfully", brgy_logo });
        },
      );
    }
  );
});

export default router;
