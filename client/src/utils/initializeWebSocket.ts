import { Dispatch } from 'react';
import { AnyAction } from 'redux';

import { FamilyData } from 'redux/_slices/userSlice';
import { socket, WebSocketAPI } from 'api/WebSocketAPI';
import fetchChatRoom from './fetchChatRoom';

const initializeWebSocket = async (
  userId: string,
  name: string,
  families: FamilyData[],
  dispatch: Dispatch<AnyAction>
) => {
  try {
    WebSocketAPI.login(userId, name);
    socket.on('login', (chats) => {
      fetchChatRoom(chats, userId, families, dispatch);
    });
  } catch (err) {
    console.log('오류가 발생했습니다. 다시 시도해 주세요. ' + err);
  }
};

export default initializeWebSocket;
