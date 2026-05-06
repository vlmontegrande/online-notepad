import mysql from "mysql2/promise";
import express from "express";

const db = await mysql.createConnection({
  host: "localhost",
  user: "notepad",
  password: "password",
  database: "online_notepad"
});

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.get("/notes", async (req, res) => {
  const [rows] = await db.query("SELECT id, content FROM notes ORDER BY id DESC LIMIT 1");
  if (rows.length === 0) return res.json({ id: null, content: "" });
  res.json(rows[0]);
});

app.post("/notes", async (req, res) => {
  const { content, lastKnownId } = req.body;
  const [rows] = await db.query("SELECT MAX(id) AS latestId FROM notes");
  const latestId = rows[0].latestId;
  if (latestId !== lastKnownId) return res.status(409).json({ error: "Conflict" });
  const [result] = await db.query("INSERT INTO notes (content) VALUES (?)", [content]);
  res.json({ id: result.insertId });
});

app.listen(8080, () => console.log("Running on port 8080!"));