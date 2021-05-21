import { registerReducer } from "./reducers/register";
import thunk from "redux-thunk";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    register: registerReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunk),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
