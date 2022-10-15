import HttpRequest from 'api/HttpRequest';

export type ChatDataType = {
  userId: string;
  joinedAt: Date;
};

export const ChatAPI = {
  addChat: (userIdList: string[]) => {
    return HttpRequest.post('/api/chat/addChat', userIdList);
  },
  findChatbyUserId: (userId: string) => {
    return HttpRequest.post('/api/chat/findChatbyUserId', { userId });
  },
};
