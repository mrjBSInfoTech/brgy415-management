import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../database/db.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import {
  clearAuthCookieOptions,
  getAuthCookieOptions,
} from "../utils/authCookies.js";

const router = express.Router();

// Login route
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  const sql = `
  SELECT 
    oa.official_account_id, 
    oa.username, 
    oa.password, 
    oa.account_type, 
    oa.can_add, 
    oa.can_edit, 
    oa.can_delete,
    oa.password_changed,
    o.first_name, 
    o.last_name, 
    o.position,
    o.image
  FROM official_account oa
  INNER JOIN official o ON oa.official_account_id = o.official_account_id
  WHERE oa.username = ?`;

  db.query(sql, [username], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });

    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result[0];
    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user.official_account_id,
        official_account_id: user.official_account_id,
        username: user.username,
        account_type: user.account_type,
        password_changed: user.password_changed,
        role: "private",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d", algorithm: "HS256" }
    );

    res.cookie("private_token", token, getAuthCookieOptions(1));

    res.json({
      success: true,
      official_account_id: user.official_account_id,
      username: user.username,
      account_type: user.account_type,
      first_name: user.first_name,
      last_name: user.last_name,
      position: user.position,
      image: user.image,
      can_add: user.can_add,
      can_edit: user.can_edit,
      can_delete: user.can_delete,
      password_changed: user.password_changed,
    });
  });
});

// Logout route
router.post("/logout", (req, res) => {
  res.clearCookie("private_token", clearAuthCookieOptions());
  res.json({ success: true, message: "Logged out successfully" });
});

// Get current authenticated official
router.get("/me", authenticateToken, (req, res) => {
  const officialId = req.user.official_account_id || req.user.id;
  const sql = `
    SELECT 
      oa.official_account_id, 
      oa.username, 
      oa.account_type, 
      oa.can_add, 
      oa.can_edit, 
      oa.can_delete,
      oa.password_changed,
      o.first_name, 
      o.last_name, 
      o.position,
      o.image
    FROM official_account oa
    INNER JOIN official o ON oa.official_account_id = o.official_account_id
    WHERE oa.official_account_id = ?`;

  db.query(sql, [officialId], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (!result.length) return res.status(404).json({ message: "Official not found" });
    res.json(result[0]);
  });
});

// Change password
router.put("/changePassword", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "Current and new passwords are required" });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  // First, get the user's current password to verify
  db.query(
    "SELECT password, username, account_type, password_changed FROM official_account WHERE official_account_id = ?",
    [userId],
    async (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      if (result.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const account = result[0];

      // Verify current password
      const isMatch = bcrypt.compareSync(currentPassword, account.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const nextPasswordChanged = Number(account.password_changed ?? 0) + 1;

      const sql =
        "UPDATE official_account SET password = ?, password_changed = ? WHERE official_account_id = ?";

      db.query(sql, [hashedPassword, nextPasswordChanged, userId], (updateErr) => {
        if (updateErr) return res.status(500).json({ error: updateErr.message });

        // Re-issue cookie with updated password_changed counter
        const nextToken = jwt.sign(
          {
            id: userId,
            official_account_id: userId,
            username: account.username,
            account_type: account.account_type,
            password_changed: nextPasswordChanged,
            role: "private",
          },
          process.env.JWT_SECRET,
          { expiresIn: "1d", algorithm: "HS256" }
        );

        res.cookie("private_token", nextToken, getAuthCookieOptions(1));

        res.json({
          message: "✅ Password updated successfully",
          password_changed: nextPasswordChanged,
        });
      });
    }
  );
});

export default router;
