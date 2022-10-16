import { io, Socket } from 'socket.io-client';
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { Dispatch } from 'react';
import { AnyAction } from 'redux';

import { FamilyData } from 'redux/_slices/userSlice';
import fetchChatRoom from 'utils/fetchChatRoom';

export type RoomJoinData = {
  userId: string;
  participantIds: string[];
};

export type MessageData = {
  chatId: string;
  message: string;
  userId: string;
  profile?: string;
  haventRead?: string[];
};

export type ReadMsgData = {
  chatId: string;
  readerId: string;
};

export let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

export const WebSocketAPI = {
  login: (
    userId: string,
    name: string,
    families: FamilyData[],
    dispatch: Dispatch<AnyAction>
  ) => {
    socket = io('http://localhost:5000/').emit('login', userId, name);

    // Listening to socket server error
    socket.on('error', (err) => {
      console.log('Socket connection error: ' + err);
    });

    socket.on('login', (chats) => {
      fetchChatRoom(chats, userId, families, dispatch);
    });

    // Listening to chat messages
    socket.on('message', (data) => {
      // console.log(data);
    });
  },
  joinRoom: (data: RoomJoinData) => {
    socket.emit('join', data);
  },
  sendMessage: (data: MessageData) => {
    socket.emit('message', data);
  },
  readMessage: (data: ReadMsgData) => {
    socket.emit('read', data);
  },
};
