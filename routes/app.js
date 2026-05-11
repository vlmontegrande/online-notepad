import express from "express";

const router = express.Router();
router.use(express.json());

router.get("/", (req, res) => {
  res.sendFile("index.html", { root: "views" });
});

router.get("/login", (req, res) => {
  res.sendFile("login.html", { root: "views" });
});

export default router;