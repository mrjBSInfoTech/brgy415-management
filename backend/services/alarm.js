import dotenv from "dotenv";
import db from "../database/db.js";
import { createAlarmService } from "./alarmService.js";

dotenv.config();

const resolveAddress = () => new Promise((resolve, reject) => {
  db.query("SELECT port_number FROM port LIMIT 1", (error, results) => {
    if (error) return reject(error);
    resolve(results?.[0]?.port_number || "192.168.1.9");
  });
});

export const alarm = createAlarmService({ resolveAddress });
