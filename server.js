import express from "express";
import { Server } from "socket.io";
import http from "http";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // or specify your domain
    methods: ["GET", "POST"],
  },
});

const lobbies = {};

io.on("connection", (socket) => {
  socket.on("join_lobby", ({ playerName, lobbyName, lobbyPasscode }) => {
    if (!playerName || !lobbyName) {
      socket.emit("lobby_error", "Missing player name or lobby name");
      return;
    }

    if (!lobbies[lobbyName]) {
      // Create new lobby
      lobbies[lobbyName] = {
        players: [],
        passcode: lobbyPasscode || "",
        maxPlayers: 8,
      };
    }

    const lobby = lobbies[lobbyName];

    if (lobby.passcode !== (lobbyPasscode || "")) {
      socket.emit("lobby_error", "Incorrect passcode");
      return;
    }

    if (lobby.players.length >= lobby.maxPlayers) {
      socket.emit("lobby_error", "Lobby is full");
      return;
    }

    lobby.players.push({ playerName, socketId: socket.id });
    socket.join(lobbyName);

    socket.emit("lobby_joined", { lobbyName, playerName });
    socket.to(lobbyName).emit("player_joined", { playerName });
  });

  socket.on("disconnect", () => {
    // Optional: remove player from lobbies and clean up empty ones
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log("Socket.IO server running on port 3000");
});
