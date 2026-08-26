import express from "express";
import db from "../database/db.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🟢 Get all citizen
router.get("/", authenticateToken, (req, res) => {
  const sql = `
    SELECT 
      u.user_id, 
      u.first_name,
      u.last_name,
      u.email,
      u.contact,
      u.type,
      u.resident_id,
      u.status,
      u.date_created,
      CONCAT_WS(' ', r.first_name, r.last_name) AS resident_name
    FROM user_account u
    LEFT JOIN resident r ON u.resident_id = r.resident_id
    ORDER BY u.user_id ASC`;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 🔍 Get single citizen by ID
router.get("/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT 
      u.*,
      CONCAT_WS(' ', r.first_name, r.last_name) AS resident_name
    FROM user_account u
    LEFT JOIN resident r ON u.resident_id = r.resident_id
    WHERE u.user_id = ?
  `;
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0)
      return res.status(404).json({ error: "Citizen not found" });
    res.json(results[0]);
  });
});

// ✏️ Unified Update: Updates Info AND Status in one go
router.put("/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const { status, resident_id, type } = req.body;

  // Build dynamic SQL - only update fields that are provided
  const updates = [];
  const values = [];

  // Only add status if provided and not empty
  if (status !== undefined && status !== null && status !== "") {
    updates.push("status = ?");
    values.push(status);
  }

  // Only add type if provided and not empty
  if (type !== undefined && type !== null && type !== "") {
    updates.push("type = ?");
    values.push(type);
  }

  // Only add resident_id if provided and not empty
  if (resident_id !== undefined && resident_id !== null && resident_id !== "") {
    updates.push("resident_id = ?");
    values.push(resident_id);
  }

  // If no fields to update, return error
  if (updates.length === 0) {
    return res.status(400).json({ message: "No valid fields to update" });
  }

  values.push(id);
  const sql = `UPDATE user_account SET ${updates.join(", ")} WHERE user_id = ?`;

  db.query(sql, values, (err) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ error: err.message });
    }

    if (status === "verified") {
      const residentSql = `
        UPDATE resident r
        JOIN user_account u ON r.resident_id = u.resident_id
        SET r.user_id = u.user_id,
            r.first_name = u.first_name,
            r.last_name = u.last_name,
            r.email = u.email,
            r.phone_number = u.contact
        WHERE u.user_id = ? AND u.resident_id IS NOT NULL
      `;
      db.query(residentSql, [id], (residentErr) => {
        if (residentErr) {
          console.error("Resident sync error:", residentErr);
        }
        return res.json({ message: "Citizen record updated successfully" });
      });
    } else {
      res.json({ message: "Citizen record updated successfully" });
    }
  });
});

// ✅ Bulk verify citizen accounts and sync resident mappings
router.put("/bulk/verify", authenticateToken, (req, res) => {
  const { ids } = req.body;
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: "An array of citizen user IDs is required." });
  }

  const verifySql = `UPDATE user_account SET status = 'verified' WHERE user_id IN (?)`;
  db.query(verifySql, [ids], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    const syncSql = `
      UPDATE resident r
      JOIN user_account u ON r.resident_id = u.resident_id
      SET r.user_id = u.user_id,
          r.first_name = u.first_name,
          r.last_name = u.last_name,
          r.email = u.email,
          r.phone_number = u.contact
      WHERE u.user_id IN (?) AND u.resident_id IS NOT NULL
    `;

    db.query(syncSql, [ids], (syncErr) => {
      if (syncErr) {
        console.error("Resident sync error:", syncErr);
      }
      res.json({ message: `${result.affectedRows} citizen(s) verified successfully.` });
    });
  });
});

// ❌ Bulk delete citizen accounts and remove resident links
router.post("/bulk/delete", authenticateToken, (req, res) => {
  const { ids } = req.body;
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: "An array of citizen user IDs is required." });
  }

  const unlinkSql = `UPDATE resident SET user_id = NULL WHERE user_id IN (?)`;
  db.query(unlinkSql, [ids], (unlinkErr) => {
    if (unlinkErr) {
      console.error("Resident unlink error:", unlinkErr);
      return res.status(500).json({ error: unlinkErr.message });
    }

    const deleteSql = `DELETE FROM user_account WHERE user_id IN (?)`;
    db.query(deleteSql, [ids], (deleteErr, result) => {
      if (deleteErr) return res.status(500).json({ error: deleteErr.message });
      res.json({ message: `${result.affectedRows} citizen(s) deleted successfully.` });
    });
  });
});

// ❌ Delete citizen user account
router.delete("/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const unlinkSql = `UPDATE resident SET user_id = NULL WHERE user_id = ?`;

  db.query(unlinkSql, [id], (unlinkErr) => {
    if (unlinkErr) {
      console.error("Resident unlink error:", unlinkErr);
      return res.status(500).json({ error: unlinkErr.message });
    }

    const sql = "DELETE FROM user_account WHERE user_id = ?";
    db.query(sql, [id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Citizen deleted successfully" });
    });
  });
});

export default router;
