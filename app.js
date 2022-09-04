const http = require("http");
const path = require('path');

const express = require("express");
const { Server } = require("socket.io");
const expressLayouts = require('express-ejs-layouts');
const morgan = require('morgan');
const dotEnv = require('dotenv');

const connectDB = require('./config/db');

//* Load Config 
dotEnv.config({path:"./config/config.env"});


const app = express(); //? Request Handler Valid createServer()
const server = http.createServer(app);
const io = new Server(server);

//* Logging 
if(process.env.NODE_ENV === "development"){
    app.use(morgan("dev"));
};

// Static folder
app.use(express.static(path.join(__dirname,"./public")));

const PORT = process.env.PORT || 3000;
server.listen(PORT,() => console.log(`server is running in ${process.env.NODE_ENV} mode on port ${PORT}`));
// server.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

//? View Engine (EJS)
app.set(expressLayouts);
app.set("view engine","ejs");
app.set("layout","./layouts/mainLayout");
app.set("views","views");

//! BodyParser
app.use(express.urlencoded({extended: false}));


//* Database Connection
connectDB();

//* Routes
app.use("/users",require('./routes/users'));

// Setup websocket
const users = {};

io.on("connection", (socket) => {
    console.log(`User connected. ${socket.id}`);


    // Listening

    socket.on("login",(nickname) => {
        console.log(`${nickname} connected!` );
        socket.emit("login",nickname);
        users[socket.id]=nickname;
        io.sockets.emit("online",users);
    });

    socket.on("disconnect", () => {
        console.log(`User disconnected.`);
        delete users[socket.id];
        io.sockets.emit("online",users);
    });

    socket.on("chat message", (data) => {
        io.sockets.emit("chat message", data);
    });

    socket.on("typing", (data) => {
        socket.broadcast.emit("typing", data);
    });
});


