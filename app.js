require('dotenv').config();

const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public"))); // Use app.use here

io.on("connection", (socket) => {
  socket.on("send-location", (data) => {
    // data must contain latitude, longitude, and userName from the client
    const { latitude, longitude, userName } = data;
    io.emit("receive-location", {
      id: socket.id,
      latitude,
      longitude,
      userName // ✅ Send the name to all clients
    });
  });

  socket.on("disconnect", () => {
    io.emit("user-disconnected", socket.id);
  });
});



app.get("/", (req, res) => {
  res.render("index");
});
const PORT = process.env.PORT || 10000;
server.listen(PORT ,() => {
  console.log(`Server running on port ${PORT}`);
});

