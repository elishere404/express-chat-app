const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
// const { v4: uuidv4 } = require('uuid'); 

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('join', (username) => {
        socket.username = username;
        socket.broadcast.emit('message', {
            username: 'System',
            message: `${username} has joined the chat`,
        });
    });

    socket.on('message', (data) => {
        io.emit('message', {
            username: data.username,
            message: data.message,
            messageId: data.messageId, // Include messageId in message object
        });
    });

    socket.on('delete', (data) => {
        io.emit('delete', {
            username: data.username,
            messageId: data.messageId,
        });
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
        if (socket.username) {
            socket.broadcast.emit('message', {
                username: 'System',
                message: `${socket.username} has left the chat`,
            });
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
