import express from "express";
import { requireAuthPage } from "../middleware/auth.js";

const router = express.Router();
router.use(express.json());

// Unauthenticated page routes

router.get("/login", (req, res) => {
  res.sendFile("login.html", { root: "views" });
});

// Authenticated page routes

router.get("/", requireAuthPage, (req, res) => {
  res.sendFile("index.html", { root: "views" });
});

router.use((req, res) => {
  res.sendFile("404.html", { root: "views" });
});

export default router;