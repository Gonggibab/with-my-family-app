import HttpRequest from 'api/HttpRequest';

export type CommentDataType = {
  postId: string;
  userId: string;
  content: string;
};

export type UpdateCommentDataType = {
  commentId: string;
  content: string;
};

export const CommentAPI = {
  addComment: (data: CommentDataType) => {
    return HttpRequest.post('/api/comments/addComment', data);
  },
  getCommentsByPost: (postId: string) => {
    return HttpRequest.post('/api/comments/getComments', { postId });
  },
  deleteComment: (commentId: string) => {
    return HttpRequest.post('/api/comments/deleteComment', {
      commentId,
    });
  },
  updateComment: (data: UpdateCommentDataType) => {
    return HttpRequest.post('/api/comments/updateComment', {
      data,
    });
  },
  countCommentbyPostId: (postId: string) => {
    return HttpRequest.post('/api/comments/countCommentbyPostId', {
      postId,
    });
  },
};
