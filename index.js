const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
// Allow CORS for all origins (you might want to restrict this in production)
app.use(cors());
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let connectedUsers = [];
const apiNamespace = io.of("/api");

apiNamespace.on("connection", (socket) => {
  connectedUsers.push(socket.id);
  apiNamespace.emit("new user", {
    message: "A new user entered the chat",
    count: connectedUsers.length,
  });

  socket.on("disconnect", () => {
    connectedUsers = connectedUsers.filter((userId) => userId !== socket.id);
    apiNamespace.emit("new user", {
      message: "A user left the chat",
      count: connectedUsers.length,
    });
  });

  socket.on("chat message", (msg) => {
    apiNamespace.emit("chat message", msg);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
