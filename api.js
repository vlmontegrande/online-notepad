import mysql from "mysql2/promise";
import express from "express";
import bcrypt from "bcrypt";

import { requireAuthAPI } from "./middleware/auth.js";

const saltRounds = 12;

const db = await mysql.createConnection({
  host: "localhost",
  user: "notepad",
  password: "password",
  database: "online_notepad"
});

const api = express.Router();

// Unauthenticated API routes

api.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ success: false, error: 'Username and password required' });

  try {
    const [rows] = await db.query("SELECT id, username, password_hash FROM users WHERE username = ?", [username]);
    if (rows.length === 0 || !(await bcrypt.compare(password, rows[0].password_hash))) return res.status(401).json({ success: false, error: "Invalid credentials" });
    const user = rows[0];
    req.session.user = { id: user.id, username: user.username };
    res.json({ success: true, data: req.session.user });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

api.get('/logout', (req, res) => {
    req.session.destroy(() => {
      res.json({ success: true })
    });
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

api.get("/bcrypt", requireAuthAPI, async (req, res) => {
  const password = req.query.password;
  const hash = await bcrypt.hash(password, saltRounds);
  res.send(hash);
});

api.get("/compare", requireAuthAPI, async (req, res) => {
  const username = req.query.username;
  const password = req.query.password;
  const [ users ] = await db.query("SELECT password_hash FROM users WHERE username=?", [username]);
  const match = await bcrypt.compare(password, users[0].password_hash);
  res.send(match);
});

api.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "API route not found",
  });
});


export default api;