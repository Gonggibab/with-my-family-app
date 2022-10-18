import { io, Socket } from 'socket.io-client';
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { Dispatch } from 'react';
import { AnyAction } from 'redux';

import {
  ChatRoomData,
  FamilyData,
  setChatRooms,
  setUnreadMsgsCount,
} from 'redux/_slices/userSlice';
import fetchChatRoom from 'utils/fetchChatRoom';
import { ChatAPI } from './ChatAPI';

export type RoomJoinData = {
  userId: string;
  participantIds: string[];
};

type MessageData = {
  chatId: string;
  msgId: string;
  message: string;
  userId: string;
  profile?: string;
  haventRead: string[];
  createdAt: Date;
};

export type SendMessageData = {
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
  initialize: (
    userId: string,
    name: string,
    families: FamilyData[],
    dispatch: Dispatch<AnyAction>
  ) => {
    socket = io('http://localhost:5000/').emit('login', userId, name);

    let chatRooms: ChatRoomData[];
    let unReadMsgCount: number;
    socket.on('login', async (chats: any[]) => {
      const data = await fetchChatRoom(chats, userId, families, dispatch);
      chatRooms = data.ChatRoomList;
      unReadMsgCount = data.unReadMsgCount;
    });

    // Listening to socket server error
    socket.on('error', (err) => {
      console.log('Socket connection error: ' + err);
    });

    // Listening to chat messages
    socket.on('message', async (data: MessageData) => {
      if (data.userId !== userId) {
        if (chatRooms.map((chat) => chat.chatId).includes(data.chatId)) {
          const ChatRoomList: ChatRoomData[] = [];
          for (const chat of chatRooms) {
            if (chat.chatId === data.chatId) {
              ChatRoomList.push({
                chatId: chat.chatId,
                users: chat.users,
                lastChat: data.message,
                unReadMsgs: chat.unReadMsgs?.concat(data),
              });
            } else {
              ChatRoomList.push(chat);
            }
          }
          dispatch(setChatRooms(ChatRoomList));
          dispatch(setUnreadMsgsCount(unReadMsgCount + 1));
        } else {
          const chatRes = await ChatAPI.findChatbyUserId(userId);
          fetchChatRoom(chatRes.data.chat, userId, families, dispatch);
        }
      }
    });
  },
  joinRoom: (data: RoomJoinData) => {
    socket.emit('join', data);
  },
  sendMessage: (data: SendMessageData) => {
    socket.emit('message', data);
  },
  readMessage: (data: ReadMsgData) => {
    socket.emit('read', data);
  },
};
