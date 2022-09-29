import { Server, Socket } from 'socket.io';
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
  ChatData,
} from '../types/websocket';

const userSocket = (
  io: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >,
  socket: Socket<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >
) => {
  const sendMessage = (data: ChatData) => {
    socket.join(data.chatId);

    socket.to(data.chatId).emit('chat', data.name);
  };

  socket.on('chat', sendMessage);
};

export default userSocket;
