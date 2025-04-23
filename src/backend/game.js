import express from "express";
import db from "./db.js";
const router = express.Router();

router.post("/create", (req, res) => {
  const { playerName } = req.body;
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    db.prepare("INSERT INTO lobbies (code, host) VALUES (?, ?)").run(
      code,
      playerName
    );
    res.json({ code });
  } catch (e) {
    res.status(500).json({ error: "Failed to create lobby." });
  }
});

router.post("/join", (req, res) => {
  const { code } = req.body;
  const row = db.prepare("SELECT * FROM lobbies WHERE code = ?").get(code);
  if (row) {
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Lobby not found." });
  }
});

export default router;
