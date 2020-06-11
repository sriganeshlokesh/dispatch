const path = require("path");
const http = require("http");
const express = require("express");
const app = express();
const PORT = 3000 || process.env.PORT;
const server = http.createServer(app);
const socketio = require("socket.io");
const io = socketio(server);
const formatMessage = require("./utils/messages");
const botName = "Mr.Dispatch";
const { userJoin, getCurrentUser } = require("./utils/users");

// Set Static Folder
app.use(express.static(path.join(__dirname, "public")));

// Run when a client connects
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    // Welcome current user
    socket.emit(
      "message",
      formatMessage(botName, "Welcome to Dispatch Chat room!")
    ); // emit to single client logging in

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined the room`)
      ); // emit to everyone except the connecting user
  });

  // Listen for chat message
  socket.on("chatMessage", (msg) => {
    io.emit("message", formatMessage("USER", msg));
  });

  // Runs when client disconnects
  socket.on("disconnect", () => {
    io.emit("message", formatMessage(botName, "A user has left the chat"));
  });
});

server.listen(PORT, () => console.log(`Server Running on Port: ${PORT}`));
