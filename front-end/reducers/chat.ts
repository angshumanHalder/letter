import { AnyAction } from "redux";
import { SOCkET_CONNECT_FAILED, SOCkET_CONNECT_SUCCESS } from "../actions/chat";

type ChatState = {
  connection: WebSocket | null;
  connectionError: string | null;
};

export const initialState: ChatState = {
  connection: null,
  connectionError: null,
};

export const chatReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case SOCkET_CONNECT_SUCCESS:
      return { ...state, connection: action.payload, connectionError: null };
    case SOCkET_CONNECT_FAILED:
      return { ...state, connection: null, connectionError: action.payload };
    default:
      return state;
  }
};
