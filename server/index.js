const express = require("express");
const { createServer } = require("node:http");
const { join } = require("node:path");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});
app.get("/receiver", (req, res) => {
  res.sendFile(join(__dirname, "receiver.html"));
});
io.on("connection", (socket) => {
  socket.on("file-meta", (data) => {
    console.log(data);
    io.emit("fs-meta", data.metadata);
  });
  socket.on("fs-start", (data) => {
    io.emit("file-share", {});
  });
  socket.on("file-raw", (data) => {
    console.log(data.buffer);
    io.emit("fs-share", data.buffer);
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
