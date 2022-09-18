import { createSlice } from '@reduxjs/toolkit';

const appSlice = createSlice({
  name: 'appSlice',
  initialState: { isDarkMode: false, currentPage: '', isLoading: false },
  reducers: {
    updateIsDarkMode: (state, action) => {
      state.isDarkMode = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export default appSlice;

export const { updateIsDarkMode, setCurrentPage, setIsLoading } =
  appSlice.actions;
