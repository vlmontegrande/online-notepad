import express from "express";
import session from "express-session";

import router from "./routes/app.js";
import api from "./api.js";
import db from "./db.js";
import MySQLSession from "express-mysql-session";
import "dotenv/config";

const port = process.env.PORT || 8080;
const isProduction = process.env.NODE_ENV === "production";

const MySQLStore = MySQLSession(session);
const sessionStore = new MySQLStore({}, db);

const app = express();

app.set("trust proxy", 1);

app.use((req, res, next) => {
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
});

app.use(express.json());
app.use(express.static('public'))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 * 365
  }
}))


app.use("/api", api);
app.use("/", router);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: "Internal server error" });
});

app.listen(port, () => console.log(`Running on port ${port}!`));
