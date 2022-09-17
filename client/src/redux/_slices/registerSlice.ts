import { createSlice } from '@reduxjs/toolkit';

const registerSlice = createSlice({
  name: 'registerSlice',
  initialState: {
    email: '',
    password: '',
    passCheck: '',
    name: '',
    bDay: '',
    validationNum: '',
    isValidatePage: false,
  },
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    setPassCheck: (state, action) => {
      state.passCheck = action.payload;
    },
    setName: (state, action) => {
      state.name = action.payload;
    },
    setBDay: (state, action) => {
      state.bDay = action.payload;
    },
    setValidationNum: (state, action) => {
      state.validationNum = action.payload;
    },
    setIsValidatePage: (state, action) => {
      state.isValidatePage = action.payload;
    },
  },
});

export default registerSlice;

export const {
  setEmail,
  setPassword,
  setPassCheck,
  setName,
  setBDay,
  setValidationNum,
  setIsValidatePage,
} = registerSlice.actions;
