import { registerReducer } from "./reducers/register";
import { userReducer } from "./reducers/user";
import thunk from "redux-thunk";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { chatReducer } from "./reducers/chat";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistStore, persistReducer } from "redux-persist";
import { Dispatch } from "react";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["chats", "localContacts"],
};

const rootReducer = {
  register: registerReducer,
  contacts: persistReducer(persistConfig, userReducer),
  chat: persistReducer(persistConfig, chatReducer),
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: [thunk],
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch | Dispatch<any>;
