import axios from "axios";
import express from "express";
import dotenv from "dotenv";
import db from "../database/db.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

let genAI = null;

const getGenAI = () => {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing. Add it to backend/.env before calling AI validation.");
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
};

const getEspAddress = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT port_number FROM port LIMIT 1"; 
    db.query(sql, (err, results) => {
      if (err) return reject(err);
      if (!results || results.length === 0) {
        return resolve("192.168.1.9"); 
      }
      
      const config = results[0];
      resolve(config.port_number);
    });
  });
};

const router = express.Router();

// 🛑 Strict Local Checking for Tripping, Jokes, and Nonsense (Saves API Quota)
export const detectMessageTripping = (text) => {
  const normalized = (text || "").toLowerCase().trim();

  if (!normalized) {
    return { valid: false, reason: "Empty message submission." };
  }

  // 1. Check for Keyboard Smashing / No meaningful vowels
  if (normalized.length > 5 && !/[aeiouy]{2,}/i.test(normalized)) {
    return { valid: false, reason: "Random character typing or keyboard smashing detected." };
  }

  const checks = [
    {
      regex: /\b(?:nakapatay|pinatay|patay|pumatay)\b.*\b(?:ipis)\b/,
      reason: "Irrelevant joke submission.",
    },
    {
      regex: /\b(?:nanakawan|nagnakaw|nangnakaw|nanakaw)\b.*\b(?:limang|5|five)\b.*\b(?:piso|peso|pesos)\b/,
      reason: "Trivial or joking theft remark.",
    },
    {
      regex: /\b(?:test|testing|gumagana ba ito|lorem ipsum)\b/,
      reason: "Test configuration submission.",
    },
    {
      regex: /^(maganda po ako|pogi ako|kumain ka na ba|hi|hello|crush ko si)$/,
      reason: "Irrelevant personal conversational remark.",
    },
    {
      regex: /^(?:asdf|qwerty|zxcvbn|lkjhg|hjkl|uiop|asdfghjkl|qwertyuiop|zxcvbnm|abc|abc123|123456)$/i,
      reason: "Keyboard smashing or random nonsense.",
    }
  ];

  const matched = checks.find(({ regex }) => regex.test(normalized));
  return matched ? { valid: false, reason: matched.reason } : null;
};

// 🛡️ Robust Emergency Fallback Mapping if AI goes offline
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

// 🧠 Contextual AI Triage (Upgraded for Distress and High-Accuracy Levels)
const classifyMessageWithAI = async (text) => {
  try {
    const ai = getGenAI();
    const model = ai.getGenerativeModel({
      // Changing from 2.0-flash to 1.5-flash stabilizes quota limits significantly
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const prompt = `
      You are an emergency triage validator for Barangay 415 Zone 42, Sampaloc, Manila.
      Analyze the resident's message and categorize it with empathy and contextual intelligence.

      --- EMOTIONAL CONTEXT & PANIC RULES ---
      - Expect severe typos, dropped letters, or structural chaos if the user is writing during a violent crisis (e.g., "nagpapatayan", "mamatay po", "nagsasaksakan", "may manyak po").
      - Understand high-stress situations. If a life-threatening or violent crime is taking place nearby, classify it immediately as HIGH urgency.
      - Distinguish real violence from casual chat. "May nagpapatayan sa kabilang bahay" means active severe violence (HIGH Urgency). "May utang po si Joseph" or "maganda po ako" are completely irrelevant to a barangay emergency dashboard (VALID: FALSE).

      --- CRITERIA MATRIX ---
      - HIGH: Violent threats, active altercations, murders/fights ("nagpapatayan"), extreme life safety concerns ("mamatay po na lasingero"), fires, structural disasters.
      - MEDIUM: Active neighborhood disruptions, severe harassment ("manyak po sa kanto"), rowdy public drunks, property theft, hazardous wiring.
      - LOW: Document inquiries, garbage collection feedback, missing streetlights, and valid neighborhood accountability complaints such as unpaid debts or non-payment issues.
      - VALID: FALSE: Joke submissions, gibberish keyboard typing, personal status statements, and unrelated social chat.

      Analyze: "${text}"

      Respond strictly in this JSON format. Provide NO extra prose, conversational remarks, or outside context.
      {
        "urgency": "High" | "Medium" | "Low",
        "type": "Emergency" | "Dispute" | "General",
        "valid": true | false
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    return JSON.parse(responseText);
  } catch (error) {
    console.error("AI Triage failed, running upgraded local safety validation chain:", error.message);
    const localFallback = classifyMessageLocally(text);
    return {
      urgency: localFallback.urgency,
      type: localFallback.type,
      valid: localFallback.valid
    };
  }
};

const triggerEspAlert = async (urgency) => {
  try {
    const ESP32_IP = await getEspAddress();
    if (urgency === "High") {
      await axios.get(`http://${ESP32_IP}/alert/high`, { timeout: 3000 });
      console.log("ESP32 High alert triggered");
    } else if (urgency === "Medium") {
      await axios.get(`http://${ESP32_IP}/alert/medium`, { timeout: 3000 });
      console.log("ESP32 Medium alert triggered");
    }
  } catch (error) {
    console.error("ESP32 trigger error:", error.message || error);
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

  if (!message || !message_type) {
    return res
      .status(400)
      .json({ message: "Please fill all required fields." });
  }

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

    // Local Regex Tripping Interceptor
    const localCheck = detectMessageTripping(message);
    if (localCheck && !localCheck.valid) {
      return res.status(400).json({
        message: "Message rejected: Out-of-topic, joke, or spam detected.",
        reason: localCheck.reason,
      });
    }

    // AI Context Evaluation
    const classification = await classifyMessageWithAI(message);

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

        await triggerEspAlert(urgency);

        res.json({
          message: "✅ Message categorized and sent",
          id: result.insertId,
          classification: { 
            type, 
            urgency, 
            valid: classification.valid
          },
        });
      }
    );
  });
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