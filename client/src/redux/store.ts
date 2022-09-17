import { configureStore } from '@reduxjs/toolkit';
import appSlice from './_slices/appSlice';
import userSlice from './_slices/userSlice';
import registerSlice from './_slices/registerSlice';

const store = configureStore({
  reducer: {
    app: appSlice.reducer,
    user: userSlice.reducer,
    register: registerSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
