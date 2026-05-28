import express from "express";
import bcryptjs from "bcryptjs";
import rateLimit from "express-rate-limit";

import { requireAuthAPI } from "./middleware/auth.js";
import db from "./db.js";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  handler: (req, res) => {
    res.status(429).json({ success: false, error: "Too many requests, try again later." });
  }
});

const api = express.Router();

// Unauthenticated API routes

api.post("/login", limiter, async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ success: false, error: 'Username and password required' });

  try {
    username = username.toLowerCase();
    const [rows] = await db.query("SELECT id, username, password_hash FROM users WHERE username = ?", [username]);
    if (rows.length === 0 || !(await bcryptjs.compare(password, rows[0].password_hash))) return res.status(401).json({ success: false, error: "Invalid credentials" });
    const user = rows[0];
    req.session.user = { id: user.id, username: user.username };
    res.json({ success: true, data: req.session.user });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Authenticated API routes

api.get("/notes", requireAuthAPI, async (req, res) => {
  const [rows] = await db.query("SELECT id, content FROM notes ORDER BY id DESC LIMIT 1");
  if (rows.length === 0) return res.json({ id: null, content: "" });
  res.json(rows[0]);
});

api.post("/notes", requireAuthAPI, async (req, res) => {
  const { content, lastKnownId } = req.body;
  const [rows] = await db.query("SELECT MAX(id) AS latestId FROM notes");
  const latestId = rows[0].latestId;
  if (latestId !== lastKnownId) return res.status(409).json({ error: "Conflict" });
  const [result] = await db.query("INSERT INTO notes (content) VALUES (?)", [content]);
  res.json({ id: result.insertId });
});

api.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "API route not found",
  });
});


export default api;