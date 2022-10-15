import HttpRequest from 'api/HttpRequest';

export type MessageType = {
  userId: string;
  joinedAt: Date;
};

export const MessageAPI = {
  findMessagebyChatId: (chatId: string) => {
    return HttpRequest.post('/api/message/findMessagebyChatId', { chatId });
  },
};
