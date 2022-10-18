import HttpRequest from 'api/HttpRequest';

export type ChatDataType = {
  userId: string;
  joinedAt: Date;
};

export const ChatAPI = {
  findChatbyUserId: (userId: string) => {
    return HttpRequest.post('/api/chat/findChatbyUserId', { userId });
  },
};
