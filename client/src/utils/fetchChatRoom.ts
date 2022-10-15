import { Dispatch } from 'react';
import { AnyAction } from 'redux';

import {
  ChatRoomData,
  ChatUserInfo,
  FamilyData,
  setChatRooms,
} from 'redux/_slices/userSlice';

const fetchChatRoom = async (
  chats: any[],
  curUserId: string,
  families: FamilyData[],
  dispatch: Dispatch<AnyAction>
) => {
  const ChatRoomList: ChatRoomData[] = [];
  for (const chat of chats) {
    const chatUserList: ChatUserInfo[] = [];
    for (const user of chat.users) {
      if (user.userId._id !== curUserId) {
        for (const family of families) {
          if (user.userId._id === family.userId) {
            chatUserList.push({
              userId: user.userId._id,
              name: user.userId.name,
              profile: user.userId.profile,
              relationship: family.relationship,
            });
          }
        }
      }
    }

    ChatRoomList.push({
      chatId: chat._id,
      users: chatUserList,
    });
  }
  dispatch(setChatRooms(ChatRoomList));
};

export default fetchChatRoom;
