import express from "express";
import { Server } from "socket.io";
import http from "http";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get("/", (req, res) => {
  res.send("Server is up!");
});

io.on("connection", (socket) => {
  console.log("a user connected");
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Listening on ${port}`);
});
