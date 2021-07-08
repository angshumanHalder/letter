import { registerReducer } from "./reducers/register";
import { contactsReducer } from "./reducers/contacts";
import thunk from "redux-thunk";
import { configureStore } from "@reduxjs/toolkit";
import { chatReducer } from "./reducers/chat";

export const store = configureStore({
  reducer: {
    register: registerReducer,
    contacts: contactsReducer,
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunk),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
