"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use('/', express_1.default.static(path_1.default.join(__dirname, '..', 'public')));
app.get('', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '..', 'src', 'views', 'index.html'));
});
app.get('/chat/:id', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '..', 'src', 'views', 'chat.html'));
});
const server = app.listen(port, () => {
    console.log(`App is running on port: ${port}`);
});
const io = new socket_io_1.Server(server);
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
