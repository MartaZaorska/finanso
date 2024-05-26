import { configureStore } from '@reduxjs/toolkit'

import appReducer from './appSlice';
import api from './api';

const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    app: appReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
  devTools: true
});

export default store;