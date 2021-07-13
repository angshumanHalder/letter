import { registerReducer } from "./reducers/register";
import { userReducer } from "./reducers/user";
import thunk from "redux-thunk";
import { configureStore } from "@reduxjs/toolkit";
import { chatReducer } from "./reducers/chat";

export const store = configureStore({
  reducer: {
    register: registerReducer,
    contacts: userReducer,
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunk),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
