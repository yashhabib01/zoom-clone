import { configureStore } from "@reduxjs/toolkit";
import slice from "./slice";

const store = configureStore({
  reducer: {
    app: slice.reducer,
  },
});

export default store;
