import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

type UserState = {
  isLogin: boolean;
  user: UserData;
  families: FamilyData[];
  familyRequests: FamilyRequestsData[];
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
  },
});

export default userSlice;

export const { setIsLogin, setUser, setFamilies, setFamilyRequests } =
  userSlice.actions;
