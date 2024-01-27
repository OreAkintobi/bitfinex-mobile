import { createSlice } from '@reduxjs/toolkit';

const SLICE_WEBSOCKET = 'websocket';

interface WebSocketState {
  isConnected: boolean;
}

const initialState: WebSocketState = {
  isConnected: false,
};

export const slice = createSlice({
  name: SLICE_WEBSOCKET,
  initialState,
  reducers: {
    setConnected: (state) => {
      state.isConnected = true;
    },
    setDisconnected: (state) => {
      state.isConnected = false;
    },
  },
});

export const { setConnected, setDisconnected } = slice.actions;

export default slice.reducer;
