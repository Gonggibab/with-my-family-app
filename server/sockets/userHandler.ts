import { Server, Socket } from 'socket.io';
import ChatModel, { IChat } from '../models/ChatModel';
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
  ChatJoinData,
  MessageData,
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
  const login = async (userId: string, name: string) => {
    socket.data.userId = userId;
    socket.data.name = name;

    console.log(`${socket.data.name} connected`);

    const chats = await ChatModel.find({
      'users.userId': { $in: [userId] },
    }).populate('users.userId');

    if (chats) {
      socket.emit('login', chats);

      chats.forEach((chat) => {
        socket.join(String(chat._id));
      });
    }
  };

  const joinRoom = async (data: ChatJoinData) => {
    try {
      // Check if chat room already exist
      const chat = await ChatModel.findOne({
        'users.userId': { $all: [data.userId, data.participantId] },
      });

      if (chat) {
        socket.emit('join', chat._id);
      } else {
        const newChat: IChat = new ChatModel({
          users: [
            { userId: data.userId, joinedAt: new Date(Date.now()) },
            { userId: data.participantId, joinedAt: new Date(Date.now()) },
          ],
        });

        const chat = await newChat.save();

        const clients = await io.fetchSockets();
        for (const client of clients) {
          if (client.data.userId === data.participantId) {
            client.join(String(chat._id));
          }
        }

        socket.join(String(chat._id));
        socket.emit('join', chat._id);
      }
    } catch (err) {
      if (err) socket.emit('error', err);
    }
  };

  const sendMessage = async (data: MessageData) => {
    socket.to(data.chatId).emit('message', {
      userId: data.userId,
      chatId: data.chatId,
      message: data.message,
    });
  };

  socket.on('login', login);
  socket.on('join', joinRoom);
  socket.on('message', sendMessage);
};

export default userSocket;
