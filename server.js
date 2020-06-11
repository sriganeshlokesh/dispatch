const path = require("path");
const http = require("http");
const express = require("express");
const app = express();
const PORT = 3000 || process.env.PORT;
const server = http.createServer(app);
const socketio = require("socket.io");
const io = socketio(server);

// Set Static Folder
app.use(express.static(path.join(__dirname, "public")));

// Run when a client connects
io.on("connection", (socket) => {
  console.log("New Web Socket Connection");
});

server.listen(PORT, () => console.log(`Server Running on Port: ${PORT}`));
