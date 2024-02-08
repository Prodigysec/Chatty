import path from 'path';
import http from 'http';
import express from 'express';
import socketio from 'socket.io';
import formatMessage from './helpers/formatDate';
import {
    getActiveUser,
    exitRoom,
    newUser,
    getIndividualRoomUsers
} from './helpers/userHelper';

// Initialize the app
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')))

const PORT = 3000 || process.env.PORT

// Run when a client connects
io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
        const user = newUser(socket.id, username, room);
        socket.join(user.room); // subscribe user to a room

        // Welcome current user
        socket.emit('message', formatMessage('Chatty', 'Welcome to Chatty!'));

        // Broadcast when a user connects
        socket.broadcast
            .to(user.room)
            .emit('message', formatMessage('Chatty', `${user.username} has joined the room`)); // emit to everyone in the room except the user

        // Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getIndividualRoomUsers(user.room)
        });

        // Get room users
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getIndividualRoomUsers(user.room)
        });
    });

    // Listen for chatMessage
    socket.on('chatMessage', msg => {
        const user = getActiveUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });
});


// Start the server
app.listen(PORT, () => console.log(`App is live on port ${PORT}`));
