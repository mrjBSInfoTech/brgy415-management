import express from "express";
import db from "../database/db.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import path from "path";
import fs from "fs";
import multer from "multer";
import { execFile } from "child_process";
import { fileURLToPath } from 'url';

const router = express.Router();

// Get absolute path for uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "..", "uploads", "uploadFiles", "pdf");

// ✅ Ensure upload folder exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// --- Multer Configuration ---
const recordStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const originalName = path.parse(file.originalname).name;
    const ext = path.extname(file.originalname);
    const safeName = originalName.replace(/[^a-zA-Z0-9_-]/g, "_");
    
    // Check if file exists and generate unique name if needed
    let filename = `${safeName}${ext}`;
    let counter = 1;
    
    while (fs.existsSync(path.join(uploadDir, filename))) {
      filename = `${safeName}_${counter}${ext}`;
      counter++;
    }
    
    cb(null, filename);
  }
});

const uploadRecord = multer({ storage: recordStorage });

// 🟢 Get all files
router.get("/", authenticateToken, (req, res) => {
  const sql = `
    SELECT 
      file_id,
      file_name,
      file_type
    FROM file
    ORDER BY file_id DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 🔍 Get single file by ID
router.get("/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT 
      file_id,
      file_name,
      file_type
    FROM file
    WHERE file_id = ?
  `;
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: "File not found" });
    res.json(results[0]);
  });
});

// Add new file (Upload and Convert)
router.post("/", authenticateToken, uploadRecord.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const filePath = path.join(uploadDir, req.file.filename);
  const ext = path.extname(req.file.originalname).toLowerCase();

  console.log("Uploaded file:", req.file.filename);
  console.log("File extension:", ext);

  if (ext === ".pdf") {
    // If it's already a PDF, store it as-is
    insertRecord(req.file.filename, "pdf", res);
  } else {
    // Convert to PDF using Python script
    const pythonScript = path.join(__dirname, "convert_to_pdf.py");

    console.log("Python script path:", pythonScript);
    console.log("File path:", filePath);
    console.log("File exists:", fs.existsSync(filePath));

    execFile("python", [pythonScript, filePath], { timeout: 30000 }, (error, stdout, stderr) => {
      if (error) {
        console.error("Conversion error:", error);
        console.error("Stderr:", stderr);
        return res.status(500).json({ message: "File conversion failed: " + stderr });
      }

      const outputPdf = stdout.trim();
      const pdfName = path.basename(outputPdf);
      
      console.log("Conversion successful. PDF name:", pdfName);
      insertRecord(pdfName, "pdf", res);
    });
  }
});

// Update file
router.put("/:id", authenticateToken, uploadRecord.single("file"), (req, res) => {
  const { id } = req.params;

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // Get old file info to delete it
  db.query("SELECT file_name FROM file WHERE file_id = ?", [id], (err, results) => {
    if (results && results[0]?.file_name) {
      const oldFilePath = path.join(uploadDir, results[0].file_name);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    const filePath = path.join(uploadDir, req.file.filename);
    const ext = path.extname(req.file.originalname).toLowerCase();

    console.log("Updated file:", req.file.filename);

    if (ext === ".pdf") {
      updateRecord(id, req.file.filename, "pdf", res);
    } else {
      const pythonScript = path.join(__dirname, "convert_to_pdf.py");

      console.log("Converting file:", filePath);

      execFile("python", [pythonScript, filePath], { timeout: 30000 }, (error, stdout, stderr) => {
        if (error) {
          console.error("Conversion error:", error);
          console.error("Stderr:", stderr);
          return res.status(500).json({ message: "File conversion failed: " + stderr });
        }

        const outputPdf = stdout.trim();
        const pdfName = path.basename(outputPdf);
        
        console.log("Conversion successful. PDF name:", pdfName);
        updateRecord(id, pdfName, "pdf", res);
      });
    }
  });
});

// ❌ Delete file
router.delete("/:id", authenticateToken, (req, res) => {
  const { id } = req.params;

  // Get file info first to delete the file from folder
  db.query("SELECT file_name FROM file WHERE file_id = ?", [id], (err, results) => {
    if (err) {
      console.error("DB Error retrieving file:", err);
      return res.status(500).json({ error: "Failed to retrieve file info" });
    }

    const storedFileName = results?.[0]?.file_name;

    // Delete related files from filesystem if they exist
    if (storedFileName) {
      try {
        deleteRelatedFiles(storedFileName);
        console.log("Related files deleted from filesystem for:", storedFileName);
      } catch (fsErr) {
        console.error("Error deleting file from filesystem:", fsErr);
        // Continue with database deletion even if filesystem delete fails
      }
    }

    // Delete from database
    db.query("DELETE FROM file WHERE file_id = ?", [id], (err) => {
      if (err) {
        console.error("DB Error deleting file:", err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "File deleted successfully" });
    });
  });
});

// Helper Functions
function deleteRelatedFiles(fileName) {
  if (!fileName) return;

  const targetPath = path.join(uploadDir, fileName);
  const parsedTarget = path.parse(fileName);
  const baseName = parsedTarget.name;

  if (fs.existsSync(targetPath)) {
    fs.unlinkSync(targetPath);
    console.log("Deleted stored file:", fileName);
  }

  if (!fs.existsSync(uploadDir)) return;

  const entries = fs.readdirSync(uploadDir);
  entries.forEach((entry) => {
    const entryPath = path.join(uploadDir, entry);
    if (!fs.statSync(entryPath).isFile()) return;

    const parsedEntry = path.parse(entry);
    if (parsedEntry.name !== baseName) return;
    if (entry === fileName) return;

    if (fs.existsSync(entryPath)) {
      fs.unlinkSync(entryPath);
      console.log("Deleted related artifact:", entry);
    }
  });
}

function insertRecord(fileName, fileType, res) {
  const sql = "INSERT INTO file (file_name, file_type) VALUES (?, ?)";
  
  db.query(sql, [fileName, fileType], (err, result) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ message: "Database insert failed" });
    }
    res.json({ message: "File uploaded successfully", id: result.insertId });
  });
}

function updateRecord(fileId, fileName, fileType, res) {
  const sql = "UPDATE file SET file_name = ?, file_type = ? WHERE file_id = ?";
  
  db.query(sql, [fileName, fileType, fileId], (err) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ message: "Database update failed" });
    }
    res.json({ message: "✅ File updated successfully" });
  });
}

export default router;