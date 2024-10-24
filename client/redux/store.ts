import { configureStore } from '@reduxjs/toolkit';
import transactionReducer from './transactionSlice'; // Adjust the path if needed

const store = configureStore({
  reducer: {
    transactions: transactionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
