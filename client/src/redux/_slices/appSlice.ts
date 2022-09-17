import { createSlice } from '@reduxjs/toolkit';

const appSlice = createSlice({
  name: 'appSlice',
  initialState: { isDarkMode: false, currentPage: '' },
  reducers: {
    updateIsDarkMode: (state, action) => {
      state.isDarkMode = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
});

export default appSlice;

export const { updateIsDarkMode, setCurrentPage } = appSlice.actions;
