import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MessageData } from 'api/WebSocketAPI';

export type UserData = {
  _id: string;
  email: string;
  birthday?: string;
  name: string;
  profile?: string;
  role: number;
};

export type FamilyData = {
  relationId: string;
  userId: string;
  name: string;
  profile?: string;
  relationship?: string;
};

export type FamilyRequestsData = {
  requestId: string;
  requesterId: string;
  name: string;
  profile?: string;
};

export type ChatUserInfo = {
  userId: string;
  name: string;
  profile?: string;
  relationship?: string;
};

export type ChatRoomMessageData = {
  userId: string;
  chatId: string;
  message: string;
  haventRead: string[];
  createdAt: string;
};

export type ChatRoomData = {
  chatId: string;
  users: ChatUserInfo[];
  lastChat?: MessageData;
  unReadMsgs?: ChatRoomMessageData[];
};

type UserState = {
  isLogin: boolean;
  user: UserData;
  families: FamilyData[];
  familyRequests: FamilyRequestsData[];
  chatRooms: ChatRoomData[];
  unreadMsgsCount: number;
};

const initialState: UserState = {
  isLogin: false,
  user: {
    _id: '',
    email: '',
    birthday: '',
    name: '',
    profile: '',
    role: 0,
  },
  families: [],
  familyRequests: [],
  chatRooms: [],
  unreadMsgsCount: 0,
};

const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    setIsLogin: (state, action: PayloadAction<boolean>) => {
      state.isLogin = action.payload;
    },
    setUser: (state, action: PayloadAction<UserData>) => {
      state.user = action.payload;
    },
    setFamilies: (state, action: PayloadAction<FamilyData[]>) => {
      state.families = action.payload;
    },
    setFamilyRequests: (state, action: PayloadAction<FamilyRequestsData[]>) => {
      state.familyRequests = action.payload;
    },
    setChatRooms: (state, action: PayloadAction<ChatRoomData[]>) => {
      state.chatRooms = action.payload;
    },
    setUnreadMsgsCount: (state, action: PayloadAction<number>) => {
      state.unreadMsgsCount = action.payload;
    },
  },
});

export default userSlice;

export const {
  setIsLogin,
  setUser,
  setFamilies,
  setFamilyRequests,
  setChatRooms,
  setUnreadMsgsCount,
} = userSlice.actions;
