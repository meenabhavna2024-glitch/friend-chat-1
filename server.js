require("./database");

const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const path = require("path");

const User = require("./models/User");
const Message = require("./models/Message");

const app = express();

app.use(cors());
app.use(express.json());


// Client folder
app.use(express.static(path.join(__dirname, "client")));


const server = http.createServer(app);


const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "home.html"));
});

// Get all users
app.get("/users", async (req, res) => {

    try {

        const users = await User.find();

        res.json(users);

    } catch (error) {

        console.log("Users Error:", error);

        res.status(500).json({
            error: error.message
        });

    }

});


// Register user
app.post("/register", async (req, res) => {

    try {

        const { name, mobile } = req.body;


        if (!name || !mobile) {

            return res.status(400).json({
                error: "Name and mobile are required"
            });

        }


        let user = await User.findOne({ mobile });


        if (user) {

            return res.json({
                message: "User already exists",
                user: user
            });

        }


        user = new User({

            name: name,
            mobile: mobile,
            online: false

        });


        await user.save();


        res.json({

            message: "User created",
            user: user

        });


    } catch (error) {

        console.log("Register Error:", error);

        res.status(500).json({

            error: error.message

        });

    }

});


// Socket.IO
io.on("connection", (socket) => {

    console.log("User connected:", socket.id);


    socket.on("send_message", async (data) => {

        try {

            const newMessage = new Message({

                sender: data.sender,
                receiver: data.receiver,
                text: data.text

            });


            await newMessage.save();


            io.emit("receive_message", data);


        } catch (error) {

            console.log("Message Error:", error);

        }

    });


    socket.on("disconnect", () => {

        console.log("User left:", socket.id);

    });

});


// Port
const PORT = process.env.PORT || 3000;


server.listen(PORT, "0.0.0.0", () => {

    console.log(`Chat Server Started on port ${PORT}`);

});