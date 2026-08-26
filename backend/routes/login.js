import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../database/db.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Register route
router.post("/register", (req, res) => {
  const { first_name, last_name, email, contact, password } = req.body;

  if (!first_name || !last_name || !email || !contact || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const sql = "INSERT INTO user_account (first_name, last_name, email, contact, password) VALUES (?, ?, ?, ?, ?)";
  
  db.query(sql, [first_name, last_name, email, contact, hashedPassword], (err) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ message: "Email already exists" });
      }
      return res.status(500).json({ message: "Database error" });
    }

    res.status(201).json({ message: "User registered successfully" });
  });
});

// Login route
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = `
  SELECT 
    user_id, 
    first_name,
    last_name,
    email,
    contact,
    date_created,
    password,
    type,
    status
  FROM user_account 
  WHERE email = ?`;

  db.query(sql, [email], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });

    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result[0];
    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accountStatus = (user.status || "").toLowerCase();

    if (accountStatus !== "verified") {
      return res.status(403).json({
        message: "Your account has not been verified yet. Please wait for approval.",
      });
    }

    const token = jwt.sign(
      {
        id: user.user_id,
        email: user.email,
        type: user.type,
        status: user.status
      },
      process.env.JWT_SECRET,
      { expiresIn: "10d" },
    );

    res.json({
      token,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      contact: user.contact,
      type: user.type,
      status: user.status,
      date_created: user.date_created,
    });
  });
});

// Change password for an authenticated public user
router.put("/changePassword", authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Current and new passwords are required" });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  if (currentPassword === newPassword) {
    return res.status(400).json({ message: "New password must be different from the current password" });
  }

  db.query(
    "SELECT password FROM user_account WHERE user_id = ?",
    [req.user.id],
    async (err, result) => {
      if (err) return res.status(500).json({ message: "Database error" });

      if (result.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const isMatch = bcrypt.compareSync(currentPassword, result[0].password);
      if (!isMatch) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }

      try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        db.query(
          "UPDATE user_account SET password = ? WHERE user_id = ?",
          [hashedPassword, req.user.id],
          (updateError) => {
            if (updateError) return res.status(500).json({ message: "Database error" });
            return res.json({ message: "Password updated successfully" });
          },
        );
      } catch {
        return res.status(500).json({ message: "Unable to update password" });
      }
    },
  );
});

export default router;
