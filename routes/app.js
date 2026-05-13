import express from "express";
import { requireAuthPage } from "../middleware/auth.js";

const router = express.Router();
router.use(express.json());

// Unauthenticated page routes

router.get("/login", (req, res) => {
  res.sendFile("login.html", { root: "views" });
});

// Authenticated page routes

router.use(requireAuthPage);

router.get("/", (req, res) => {
  res.sendFile("index.html", { root: "views" });
});

export default router;