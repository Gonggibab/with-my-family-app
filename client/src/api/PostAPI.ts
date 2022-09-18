import HttpRequest from 'api/HttpRequest';

export type PostDataType = {
  userId: string;
  content: string;
};

export const PostAPI = {
  upload: (data: PostDataType) => {
    return HttpRequest.post('/api/posts/upload', data);
  },
  getByUser: (userId: string) => {
    return HttpRequest.post('/api/posts/findByUser', { userId });
  },
};
