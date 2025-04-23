import express from "express";
import http from "http";
import { Server } from "socket.io";
import db from "./db.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.json());

// Helper to generate 6-digit lobby codes
function generateLobbyCode() {
  return Math.random().toString().slice(2, 8);
}

// --- Create Lobby ---
app.post("/api/game/create", (req, res) => {
  const { playerName } = req.body;
  const code = generateLobbyCode();

  const host = playerName; // Use the playerName as host
  const players = JSON.stringify([]); // socket.id will be added on connect
  const state = JSON.stringify({});

  db.prepare(
    "INSERT INTO lobbies (code, host, players, state) VALUES (?, ?, ?, ?)"
  ).run(code, host, players, state);

  res.json({ code });
});

// --- Join Lobby ---
app.post("/api/game/join", (req, res) => {
  const { code } = req.body;
  const lobby = db.prepare("SELECT * FROM lobbies WHERE code = ?").get(code);
  res.json({ success: !!lobby });
});

// --- Socket.IO Setup ---
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join-lobby", ({ code, name }) => {
    const row = db
      .prepare("SELECT players, host FROM lobbies WHERE code = ?")
      .get(code);
    if (!row) return;

    const players = JSON.parse(row.players || "[]");

    // Add player to the players list with their socket.id
    players.push({ name, socketId: socket.id });

    db.prepare("UPDATE lobbies SET players = ? WHERE code = ?").run(
      JSON.stringify(players),
      code
    );

    socket.join(code);
    io.to(code).emit("player-joined", { name, socketId: socket.id });
  });

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);

    // Remove from all lobbies
    const rows = db.prepare("SELECT code, players, host FROM lobbies").all();
    for (const { code, players, host } of rows) {
      // Remove player from the list
      const updatedPlayers = JSON.parse(players).filter(
        (p) => p.socketId !== socket.id
      );
      db.prepare("UPDATE lobbies SET players = ? WHERE code = ?").run(
        JSON.stringify(updatedPlayers),
        code
      );
      io.to(code).emit("player-left", socket.id);

      // If the host disconnects, reassign the host (first player becomes the new host)
      if (host === socket.id && updatedPlayers.length > 0) {
        const newHost = updatedPlayers[0].socketId;
        db.prepare("UPDATE lobbies SET host = ? WHERE code = ?").run(
          newHost,
          code
        );
        io.to(code).emit("host-changed", { oldHost: socket.id, newHost });
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on ${PORT}`));
