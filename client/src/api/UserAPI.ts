import HttpRequest from 'api/HttpRequest';

export type UserDataType = {
  email: string;
  password?: string;
  name: string;
  birthday?: Date;
  role: number;
};

export type checkDupDataType = {
  email: string;
};

export type LoginDataType = {
  email: string;
  password: string;
  isRemainLogin: boolean;
};

export type NaverLoginDataType = {
  token: string;
};

export type GoogleLoginDataType = {
  email: string;
  name: string;
  profile: string;
  role: number;
};

export type FamilyRequestDataType = {
  requesterId: string;
  requesteeId: string;
};

export const UserAPI = {
  register: (data: UserDataType) => {
    return HttpRequest.post('/api/users/register', data);
  },
  checkDuplicateEmail: (data: checkDupDataType) => {
    return HttpRequest.post('/api/users/isDupEmail', data);
  },
  login: (data: LoginDataType) => {
    return HttpRequest.post('/api/users/login', data);
  },
  naverLogin: (data: NaverLoginDataType) => {
    return HttpRequest.post('/api/naver/login', data);
  },
  googleLogin: (data: GoogleLoginDataType) => {
    return HttpRequest.post('/api/google/login', data);
  },
  auth: () => {
    return HttpRequest.get('/api/users/auth');
  },
  logout: () => {
    return HttpRequest.get('/api/users/logout');
  },
  getUser: (userId: string) => {
    return HttpRequest.post('/api/users/findUser', { userId });
  },
  searchUser: (string: string) => {
    return HttpRequest.post('/api/users/searchUser', { string });
  },
};
