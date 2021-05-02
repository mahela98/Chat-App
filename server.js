const path = require('path');
const http = require('http');
const express = require('express');
const scoketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {
    userJoin,
    getCurrentUser,
    getRoomUsers,
    userleaves
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = scoketio(server);

const PORT =  process.env.PORT || 3000;

// set a static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = '';


//run when a client join
io.on('connection', socket => {
    // console.log('new connection ..');

    //username and room comes from main.js
    socket.on('joinRoom', ({
        username,
        room
    }) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        //sents to the frontend main.js file when new user connects (only for the user)
        // socket.emit('message', formatMessage(botName, 'Welcome to chat !'));
        socket.emit('messageFromBot', formatMessage(botName, 'Welcome to chat !'));

        //brodcast when a user connects (all users execpt joined one )
        socket.broadcast.to(user.room).emit('messageFromBot', formatMessage(botName, `${user.username} has joined the chat`));

        //send users and room info
        io.to(user.room).emit('roomUsers', {
            room :user.room,
            users: getRoomUsers(user.room)

        });
    });

    

    // listen for chat message
    socket.on('chatMessage', msg => {
        // console.log(msg);
        const user = getCurrentUser(socket.id);
        // (io.emit ) for all users
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    // when a user left the chat
    socket.on('disconnect', () => {

        const user = userleaves(socket.id);
        if(user){
            io.to(user.room).emit('messageFromBot', formatMessage(botName, `${user.username} has left the chat`));

             //send users and room info
        io.to(user.room).emit('roomUsers', {
            room :user.room,
            users: getRoomUsers(user.room)

        });

        }

    });
});

server.listen(PORT, () => console.log(`server running on PORT : ${PORT}`));