import { configureStore } from '@reduxjs/toolkit';
import websocketReducer from './slices/websocket';
import orderBookReducer from './slices/order-book';
import precisionReducer from './slices/precision';

export const store = configureStore({
  reducer: {
    websocket: websocketReducer,
    orderBook: orderBookReducer,
    precision: precisionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export * from './slices/order-book';
