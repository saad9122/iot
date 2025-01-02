// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import deviceReducer from './featuers/device/devicesSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      devices: deviceReducer,
    },
  });
};

// Infer types
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
