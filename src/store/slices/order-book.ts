import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const SLICE_ORDER_BOOK = 'orderBook';

export type OrderBookEntry = {
  count: number;
  amount: number;
  total: number;
  price: number;
};

export type OrderBookState = {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
};

const initialState: OrderBookState = {
  bids: [],
  asks: [],
};

const orderBookSlice = createSlice({
  name: SLICE_ORDER_BOOK,
  initialState,
  reducers: {
    updateOrderBook: (state, action: PayloadAction<OrderBookState>) => {
      state.bids = action.payload.bids;
      state.asks = action.payload.asks;
    },
  },
});

export const { updateOrderBook } = orderBookSlice.actions;
export default orderBookSlice.reducer;
