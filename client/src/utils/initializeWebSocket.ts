import { Dispatch } from 'react';
import { AnyAction } from 'redux';

import { FamilyData } from 'redux/_slices/userSlice';
import { WebSocketAPI } from 'api/WebSocketAPI';

const initializeWebSocket = async (
  userId: string,
  name: string,
  families: FamilyData[],
  dispatch: Dispatch<AnyAction>
) => {
  try {
    WebSocketAPI.login(userId, name, families, dispatch);
  } catch (err) {
    console.log('오류가 발생했습니다. 다시 시도해 주세요. ' + err);
  }
};

export default initializeWebSocket;
