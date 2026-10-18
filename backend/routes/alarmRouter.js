import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";

export function createAlarmRouter(alarm) {
  const router = express.Router();
  router.use(authenticateToken);
  router.use((req, res, next) => {
    if (!["Admin", "Staff"].includes(req.user.account_type)) {
      return res.status(403).json({ message: "Only officials can control the alarm." });
    }
    next();
  });

  router.get("/status", (req, res) => res.json(alarm.getStatus()));

  for (const level of ["high", "medium", "clear"]) {
    const trigger = async (req, res, next) => {
      try {
        const result = await alarm.sendAlert(level);
        const statusCode = result.status === "unavailable" ? 503
          : result.status === "unconfirmed" ? 202 : 200;
        res.status(statusCode).json(result);
      } catch (error) {
        next(error);
      }
    };
    router.post(`/alert/${level}`, trigger);
    // Preserve the old URLs, now restricted to signed-in officials.
    router.get(`/alert/${level}`, trigger);
  }

  return router;
}
