import HttpRequest from 'api/HttpRequest';

export type readMsgData = {
  chatId: string;
  userId: string;
};

export const MessageAPI = {
  findMessagebyChatId: (chatId: string) => {
    return HttpRequest.post('/api/message/findMessagebyChatId', { chatId });
  },
  readMessagebyChatId: (data: readMsgData) => {
    return HttpRequest.post('/api/message/readMessagebyChatId', { data });
  },
};
