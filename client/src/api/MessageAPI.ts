import HttpRequest from 'api/HttpRequest';

export type findMsgData = {
  chatId: string;
  load: number;
};

export type readMsgData = {
  chatId: string;
  userId: string;
};

export type countUnreadMsgData = {
  chatId: string;
  userId: string;
};

export const MessageAPI = {
  findMessagebyChatId: (data: findMsgData) => {
    return HttpRequest.post('/api/message/findMessagebyChatId', { data });
  },
  readMessagebyChatId: (data: readMsgData) => {
    return HttpRequest.post('/api/message/readMessagebyChatId', { data });
  },
  findRecentMessagebyChatId: (chatId: string) => {
    return HttpRequest.post('/api/message/findRecentMessagebyChatId', {
      chatId,
    });
  },
  countUnreadMessage: (data: countUnreadMsgData) => {
    return HttpRequest.post('/api/message/countUnreadMessage', { data });
  },
};
