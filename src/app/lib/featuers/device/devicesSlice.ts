// store/deviceSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DeviceState {
  numberOfDevices: number;
}

const initialState: DeviceState = {
  numberOfDevices: 0,
};

const deviceSlice = createSlice({
  name: 'devices',
  initialState,
  reducers: {
    initializeCount: (state, action: PayloadAction<number>) => {
      state.numberOfDevices = action.payload;
    },
    addDevice: (state) => {
      state.numberOfDevices += 1;
    },
    removeDevice: (state) => {
      if (state.numberOfDevices > 0) {
        state.numberOfDevices -= 1;
      }
    },
  },
});

export const { initializeCount, addDevice, removeDevice } = deviceSlice.actions;
export default deviceSlice.reducer;
