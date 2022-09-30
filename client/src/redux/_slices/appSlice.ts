import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AppState = {
  isDarkMode: boolean;
  currentPage: string;
  isLoading: boolean;
};

const initialState: AppState = {
  isDarkMode: false,
  currentPage: '',
  isLoading: false,
};

const appSlice = createSlice({
  name: 'appSlice',
  initialState,
  reducers: {
    updateIsDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<string>) => {
      state.currentPage = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export default appSlice;

export const { updateIsDarkMode, setCurrentPage, setIsLoading } =
  appSlice.actions;
