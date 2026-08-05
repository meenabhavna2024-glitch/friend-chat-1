const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const path = require("path");

const app = express();

app.use(cors());

// client folder को serve करेगा
app.use(express.static(path.join(__dirname, "client")));

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

io.on("connection", (socket) => {

    console.log("User connected:", socket.id);

    socket.on("send_message", (data) => {
        io.emit("receive_message", data);
    });

    socket.on("disconnect", () => {
        console.log("User left:", socket.id);
    });

});

const PORT = 3000;

server.listen(PORT, "0.0.0.0", () => {
    console.log(`Chat Server Started on port ${PORT}`);
});