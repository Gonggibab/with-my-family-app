import { Dispatch } from 'react';
import { AnyAction } from 'redux';
import { socket, WebSocketAPI } from 'api/WebSocketAPI';
import {
  ChatRoomData,
  FamilyData,
  setChatRooms,
} from 'redux/_slices/userSlice';

const initializeWebSocket = async (
  userId: string,
  name: string,
  dispatch: Dispatch<AnyAction>
) => {
  try {
    WebSocketAPI.login(userId, name);
    socket.on('login', (chats) => {
      const ChatRoomList: ChatRoomData[] = [];
      for (const chat of chats) {
        for (const user of chat.users) {
          if (user.userId._id !== userId) {
            ChatRoomList.push({
              chatId: chat._id,
              userId: user.userId._id,
              name: user.userId.name,
              profile: user.userId.profile,
            });
          }
        }
      }
      dispatch(setChatRooms(ChatRoomList));
    });
  } catch (err) {
    console.log('오류가 발생했습니다. 다시 시도해 주세요. ' + err);
  }
};

export default initializeWebSocket;
