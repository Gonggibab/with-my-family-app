import HttpRequest from 'api/HttpRequest';

export type DdabongDataType = {
  postId: string;
  userId: string;
};

export const DdabongAPI = {
  addDdabong: (data: DdabongDataType) => {
    return HttpRequest.post('/api/ddabong/addDdabong', data);
  },
  getDdabongByPost: (postId: string) => {
    return HttpRequest.post('/api/ddabong/findDdabongbyPostId', { postId });
  },
  deleteDdabong: (ddabongId: string) => {
    return HttpRequest.post('/api/ddabong/deleteDdabong', {
      ddabongId,
    });
  },
  countDdabongbyPostId: (postId: string) => {
    return HttpRequest.post('/api/ddabong/countDdabongbyPostId', {
      postId,
    });
  },
};
