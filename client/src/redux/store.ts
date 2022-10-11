import { configureStore } from '@reduxjs/toolkit';
import appSlice from './_slices/appSlice';
import userSlice from './_slices/userSlice';

const store = configureStore({
  reducer: {
    app: appSlice.reducer,
    user: userSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
