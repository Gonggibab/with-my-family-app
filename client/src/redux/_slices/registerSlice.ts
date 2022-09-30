import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type RegisterState = {
  email: string;
  password: string;
  passCheck: string;
  name: string;
  bDay: string;
  validationNum: string;
  isValidatePage: boolean;
};

const initialState: RegisterState = {
  email: '',
  password: '',
  passCheck: '',
  name: '',
  bDay: '',
  validationNum: '',
  isValidatePage: false,
};

const registerSlice = createSlice({
  name: 'registerSlice',
  initialState,
  reducers: {
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    setPassCheck: (state, action: PayloadAction<string>) => {
      state.passCheck = action.payload;
    },
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setBDay: (state, action: PayloadAction<string>) => {
      state.bDay = action.payload;
    },
    setValidationNum: (state, action: PayloadAction<string>) => {
      state.validationNum = action.payload;
    },
    setIsValidatePage: (state, action: PayloadAction<boolean>) => {
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
