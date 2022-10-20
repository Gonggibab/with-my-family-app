import HttpRequest from 'api/HttpRequest';

export type PostDataType = {
  userId: string;
  content: string;
};

export type GetUserPostsType = {
  userId: string;
  size: number;
  load: number;
};

export type GetFamilyPostsType = {
  userIdList: string[];
  size: number;
  load: number;
};

export type PostUpdateDataType = {
  postId: string;
  content: string;
};

export const PostAPI = {
  upload: (data: PostDataType) => {
    return HttpRequest.post('/api/posts/upload', data);
  },
  getPost: (postId: string) => {
    return HttpRequest.post('/api/posts/findPost', { postId });
  },
  getPostsByUser: (data: GetUserPostsType) => {
    return HttpRequest.post('/api/posts/findByUser', { data });
  },
  countUserPost: (userId: string) => {
    return HttpRequest.post('/api/posts/countUserPost', { userId });
  },
  delete: (postId: string) => {
    return HttpRequest.post('/api/posts/deletePost', { postId });
  },
  getFamilyPost: (data: GetFamilyPostsType) => {
    return HttpRequest.post('/api/posts/getFamilyPost', { data });
  },
  updatePost: (data: PostUpdateDataType) => {
    return HttpRequest.post('/api/posts/updatePost', { data });
  },
};
