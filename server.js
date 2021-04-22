const path = require ('path');
const http = require('http');
const express = require('express');
const scoketio = require('socket.io');


const app = express();
const server = http.createServer(app);
const io = scoketio(server);

const PORT = 3000 || process.env.PORT;

// set a static folder
app.use(express.static(path.join(__dirname,'public'))); 

//run when a client join
io.on('connection',socket => {
    // console.log('new connection ..');

    //sents to the frontend main.js file when new user connects (only for the user)
    socket.emit('message','Welcome to chat !');

    //brodcast when a user connects (all users execpt joined one )
    socket.broadcast.emit('message','A user has joined the chat');
// (io.emit ) for all users

// when a user left the chat
socket.on('disconnect',() => {
    io.emit('message','A user has left the chat');
});

});

server.listen(PORT,()=> console.log(`server running on PORT : ${PORT}`));