import { io, Socket } from 'socket.io-client';
import { DefaultEventsMap } from '@socket.io/component-emitter';

export let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

export type RoomJoinData = {
  userId: string;
  participantId: string;
  chatId?: string;
};

export type MessageData = {
  userId: string;
  chatId: string;
  message: string;
};

export const WebSocketAPI = {
  login: (userId: string, name: string) => {
    socket = io('http://localhost:5000/').emit('login', userId, name);

    // Listening to socket server error
    socket.on('error', (err) => {
      console.log('Socket connection error: ' + err);
    });

    // Listening to chat messages
    socket.on('message', (data) => {
      console.log(data);
    });
  },
  joinRoom: (data: RoomJoinData) => {
    socket.emit('join', data);
  },
  sendMessage: (data: MessageData) => {
    socket.emit('message', data);
  },
};
