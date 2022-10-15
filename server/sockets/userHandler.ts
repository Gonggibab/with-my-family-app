import { Server, Socket } from 'socket.io';
import ChatModel, { IChat } from '../models/ChatModel';
import MessageModel, { IMessage } from '../models/MessageModel';
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
    try {
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
    } catch (err) {
      console.log(err);
      if (err) socket.emit('error', err);
    }
  };

  const joinRoom = async (data: ChatJoinData) => {
    try {
      // Check if chat room already exist
      const chat = await ChatModel.findOne({
        'users.userId': { $all: [data.userId, ...data.participantIds] },
      });

      if (chat) {
        socket.emit('join', chat._id);
      } else {
        const newChat: IChat = new ChatModel({
          users: [
            { userId: data.userId, joinedAt: new Date(Date.now()) },
            data.participantIds.map((id) => ({
              userId: id,
              joinedAt: new Date(Date.now()),
            })),
          ],
        });

        const chat = await newChat.save();

        // if other user in socket server, join the user in the room
        const clients = await io.fetchSockets();
        for (const client of clients) {
          for (const participant of data.participantIds)
            if (client.data.userId === participant) {
              client.join(String(chat._id));
            }
        }

        socket.join(String(chat._id));
        socket.emit('join', chat._id);
      }
    } catch (err) {
      console.log(err);
      if (err) socket.emit('error', err);
    }
  };

  const sendMessage = async (data: MessageData) => {
    try {
      const message: IMessage = new MessageModel({
        userId: data.userId,
        chatId: data.chatId,
        message: data.message,
        haventRead: [{ userId: data.recieverIds }],
      });
      const msgRes = await message.save();

      io.to(data.chatId).emit('message', {
        chatId: String(msgRes.chatId),
        message: msgRes.message,
        userId: String(msgRes.userId),
        profile: data?.profile,
        recieverIds: data.recieverIds,
        createdAt: msgRes.createdAt,
      });
    } catch (err) {
      console.log(err);
      if (err) socket.emit('error', err);
    }
  };

  socket.on('login', login);
  socket.on('join', joinRoom);
  socket.on('message', sendMessage);
};

export default userSocket;
