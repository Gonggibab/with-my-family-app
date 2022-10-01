import HttpRequest from 'api/HttpRequest';

export type PostDataType = {
  userId: string;
  content: string;
};

export const PostAPI = {
  upload: (data: PostDataType) => {
    return HttpRequest.post('/api/posts/upload', data);
  },
  getPost: (postId: string) => {
    return HttpRequest.post('/api/posts/findPost', { postId });
  },
  getByUser: (userId: string) => {
    return HttpRequest.post('/api/posts/findByUser', { userId });
  },
  countUserPost: (userId: string) => {
    return HttpRequest.post('/api/posts/countUserPost', { userId });
  },
  delete: (postId: string) => {
    return HttpRequest.post('/api/posts/deletePost', { postId });
  },
  getRecentPost: (userIdList: string[]) => {
    return HttpRequest.post('/api/posts/getRecentPost', { userIdList });
  },
};
