import { MessageAPI } from 'api/MessageAPI';
import { Dispatch } from 'react';
import { AnyAction } from 'redux';

import {
  ChatRoomData,
  ChatUserInfo,
  FamilyData,
  setChatRooms,
  setUnreadMsgsCount,
} from 'redux/_slices/userSlice';
import compareTime from './compareTime';

const fetchChatRoom = async (
  chats: any[],
  curUserId: string,
  families: FamilyData[],
  dispatch: Dispatch<AnyAction>
) => {
  const ChatRoomList: ChatRoomData[] = [];
  let unReadMsgCount = 0;
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

    const recentMsgRes = await MessageAPI.findRecentMessagebyChatId(chat._id);
    const unreadMsgRes = await MessageAPI.countUnreadMessage({
      chatId: chat._id,
      userId: curUserId,
    });
    ChatRoomList.push({
      chatId: chat._id,
      users: chatUserList,
      lastChat: recentMsgRes.data.message,
      unReadMsgs: unreadMsgRes.data.messages,
    });
    unReadMsgCount += unreadMsgRes.data.messages.length;
  }
  ChatRoomList.sort((a, b) => {
    if (!b.lastChat) {
      return -1;
    } else if (!a.lastChat) {
      return 1;
    }
    return compareTime(a.lastChat.createdAt, b.lastChat.createdAt);
  });

  dispatch(setChatRooms(ChatRoomList));
  dispatch(setUnreadMsgsCount(unReadMsgCount));

  return { ChatRoomList, unReadMsgCount };
};

export default fetchChatRoom;
