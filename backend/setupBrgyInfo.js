import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "barangay_management",
  port: process.env.DB_PORT || 3307,
});

db.connect((err) => {
  if (err) {
    console.error("❌ Failed to connect to MySQL:", err.message);
    process.exit(1);
  }
  console.log("✅ Connected to MySQL!");

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS brgy_info (
      info_id INT AUTO_INCREMENT PRIMARY KEY,
      brgy_name VARCHAR(255) NOT NULL,
      mission TEXT,
      vision TEXT,
      brgy_logo VARCHAR(255),
      about TEXT,
      color_scheme VARCHAR(50),
      date_altered TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;

  db.query(createTableQuery, (err) => {
    if (err) {
      console.error("❌ Error creating table:", err.message);
      db.end();
      process.exit(1);
    }
    console.log("✅ Table brgy_info created or already exists.");

    // Check if data already exists
    db.query("SELECT COUNT(*) AS count FROM brgy_info", (err, results) => {
      if (err) {
        console.error("❌ Error checking data:", err.message);
        db.end();
        process.exit(1);
      }

      if (results[0].count === 0) {
        const insertQuery = `
          INSERT INTO brgy_info (brgy_name, mission, vision, brgy_logo, about, color_scheme)
          VALUES (?, ?, ?, ?, ?, ?)
        `;
        const values = [
          "Barangay 415, Zone 42",
          "",
          "",
          "BarangayIcon.png",
          "Barangay 415 is dedicated to providing efficient public service, maintaining peace and order, and building a prosperous community for all residents in Sampaloc, Manila. Established with a rich heritage of community collaboration, we strive to leverage digital tools to enhance administrative transparency, security, and public welfare.",
          "#1e1f87"
        ];

        db.query(insertQuery, values, (err) => {
          if (err) {
            console.error("❌ Error inserting default data:", err.message);
          } else {
            console.log("✅ Inserted default brgy_info data.");
          }
          db.end();
        });
      } else {
        console.log("ℹ️ Default data already exists. Skipping insert.");
        db.end();
      }
    });
  });
});
