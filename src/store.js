import { configureStore } from "@reduxjs/toolkit";
import { apiService } from "./Services/api";

export const store = configureStore({
  reducer: {
    [apiService.reducerPath]: apiService.reducer,
  },
  middleware: (getDefault) => getDefault().concat(apiService.middleware),
});