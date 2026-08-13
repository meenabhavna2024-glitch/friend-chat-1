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

// client folder serve
app.use(express.static(path.join(__dirname, "client")));

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});


// Test route
app.get("/", (req,res)=>{
    res.send("Friend Chat Server Running");
});
// Get all users
app.get("/users", async (req, res) => {

    try {

        const users = await User.find();

        res.json(users);

    } catch(error) {

        res.status(500).json({
            error: error.message
        });

    }

});

// User Register API
app.post("/register", async (req,res)=>{

    try{

        const {name, mobile} = req.body;

        let user = await User.findOne({mobile});

        if(user){
            return res.json({
                message:"User already exists",
                user
            });
        }


        user = new User({
            name,
            mobile,
            online:false
        });


        await user.save();


        res.json({
            message:"User created",
            user
        });


    }catch(error){

        res.status(500).json({
            error:error.message
        });

    }

});



// Socket Connection

io.on("connection", (socket)=>{


    console.log("User connected:", socket.id);



    socket.on("send_message", async (data)=>{

        try{

            const newMessage = new Message({

                sender:data.sender,

                receiver:data.receiver,

                text:data.text

            });


            await newMessage.save();


            io.emit("receive_message", data);


        }catch(error){

            console.log(error);

        }


    });



    socket.on("disconnect",()=>{

        console.log("User left:", socket.id);

    });


});



const PORT = process.env.PORT || 3000;


server.listen(PORT,"0.0.0.0",()=>{

    console.log(`Chat Server Started on port ${PORT}`);

});