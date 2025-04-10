import socketIo from 'socket.io';
import socketController from './controller/socketController.js';

const socketHandler = (server) => {
    const io = socketIo(server, {
        cors: {
            origin: '*',
        },
    });

    io.on('connection', (socket) => {
        socketController(io, socket); // 👈 ส่ง socket และ io เข้า controller
    });
};
export default socketHandler;