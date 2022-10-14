import HttpRequest from 'api/HttpRequest';

export type ChatDataType = {
  userId: string;
  joinedAt: Date;
};

export const ChatAPI = {
  addChat: (userIdList: string[]) => {
    let data = [];
    for (const userId of userIdList) {
      data.push({
        userId: userId,
        joinedAt: new Date(Date.now()),
      });
    }

    return HttpRequest.post('/api/chat/addChat', data);
  },
};
