import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

io.on("connection", (socket) => {
  console.log("a user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("user disconnected:", socket.id);
  });

  socket.on("play_card", (cardData) => {
    // Broadcast to all other players
    socket.broadcast.emit("card_played", cardData);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

io.on("connection", (socket) => {
  socket.on("join_lobby", ({ playerName, lobbyName, lobbyPasscode }) => {
    // Basic example: you could use a Map or DB later
    if (!lobbyName || !playerName) {
      socket.emit("lobby_error", "Missing name or lobby");
      return;
    }

    socket.join(lobbyName);
    console.log(`${playerName} joined lobby ${lobbyName}`);

    // You might want to keep track of players in memory
    socket.emit("lobby_joined", { lobbyName, playerName });
    socket.to(lobbyName).emit("player_joined", { playerName });
  });
});
