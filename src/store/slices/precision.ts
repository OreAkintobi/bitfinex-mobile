import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../';

const SLICE_PRECISION = 'precision';

interface PrecisionState {
  precision: any;
}

const initialState: PrecisionState = {
  precision: 'P0',
};

export const precisionSlice = createSlice({
  name: SLICE_PRECISION,
  initialState,
  reducers: {
    updatePrecision: (state, action: PayloadAction<any>) => {
      state.precision = action.payload;
    },
  },
});

export const { updatePrecision } = precisionSlice.actions;
export const selectPrecision = (state: RootState) => state.precision.precision;

export default precisionSlice.reducer;
