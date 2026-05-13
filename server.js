import mysql from "mysql2/promise";
import express from "express";
import session from "express-session";
import "dotenv/config";
import MySQLSession from "express-mysql-session";

import router from "./routes/app.js";
import api from "./api.js";

const MySQLStore = MySQLSession(session);

const db = await mysql.createConnection({
  host: "localhost",
  user: "notepad",
  password: "password",
  database: "online_notepad"
});

const sessionStore = new MySQLStore({}, db);

const app = express();

app.use(express.json());
app.use(express.static('public'))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 60 * 24 * 365
  }
}))


app.use("/api", api);
app.use("/", router);

app.listen(8080, () => console.log("Running on port 8080!"));