import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'userSlice',
  initialState: {
    isLogin: false,
    user: {
      _id: '',
      email: '',
      birthday: '',
      name: '',
      role: 0,
    },
  },
  reducers: {
    setIsLogin: (state, action) => {
      state.isLogin = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export default userSlice;

export const { setIsLogin, setUser } = userSlice.actions;
