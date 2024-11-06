import express from 'express';
import path from 'path';
import { Server } from 'socket.io';

const app = express();
const port = process.env.PORT || 3000;

app.use('/', express.static(path.join(__dirname, '..', 'public')));

app.get('', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'src', 'views', 'index.html'));
});

app.get('/chat/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'src', 'views', 'chat.html'));
});

const server = app.listen(port, () => {
    console.log(`App is running on port: ${port}`);
});

const io = new Server(server);

io.on('connection', (socket) => {
    //console.log('Se conectó un cliente:', socket.id);

    socket.on('joinRoom', ({ room, username }) => {
        const roomName = `room-${room}`;
        socket.join(roomName);
        console.log(`${username} se unió a la sala ${roomName}`);
        io.to(roomName).emit('userJoined', `${username} se ha unido a la sala.`);
    });

    socket.on('sendNewMessage', (data) => {
        const room = `room-${data.room}`;
        console.log('Recibiste un mensaje: ', data);

        socket.to(room).emit('messageReceived', data);
    });
});
