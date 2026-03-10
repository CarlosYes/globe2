const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

let activeUsers = new Map();

io.on('connection', (socket) => {
    socket.on('update_position', (userData) => {
        activeUsers.set(socket.id, { ...userData, id: socket.id });
        io.emit('radar_update', Array.from(activeUsers.values()));
    });

    socket.on('disconnect', () => {
        activeUsers.delete(socket.id);
        io.emit('radar_update', Array.from(activeUsers.values()));
    });
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => console.log(`Servidor Online na porta ${PORT}`));
