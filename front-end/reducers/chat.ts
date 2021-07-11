import { AnyAction } from "redux";
import {
  REMOVE_ACTIVE_CHAT_USER_ID,
  SET_ACTIVE_CHAT,
  REMOVE_ACTIVE_CHAT,
  FETCH_ALL_CHATS_FROM_STORAGE_SUCCESS,
  FETCH_ALL_CHATS_FROM_STORAGE_ERROR,
  SET_ACTIVE_CHAT_USER_ID,
  ADD_MESSAGE_TO_ACTIVE_CHAT,
} from "../actions/chat";
import cloneDeep from "clone-deep";

type ChatState = {
  activeChatUserId: string | null;
  activeChat: ActiveChatMessages | null;
  chats: Chat | null;
  chatsFetchError: string | null;
};

export const initialState: ChatState = {
  activeChatUserId: null,
  activeChat: null,
  chats: null,
  chatsFetchError: null,
};

export const chatReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case FETCH_ALL_CHATS_FROM_STORAGE_SUCCESS:
      return {
        ...state,
        chats: action.payload as Chat,
        chatsFetchError: null,
      };
    case FETCH_ALL_CHATS_FROM_STORAGE_ERROR:
      return { ...state, chats: null, chatsFetchError: action.payload };
    case SET_ACTIVE_CHAT_USER_ID:
      return { ...state, activeChatUserId: action.payload as string };
    case REMOVE_ACTIVE_CHAT_USER_ID:
      return { ...state, activeChatUserId: null };
    case SET_ACTIVE_CHAT:
      return { ...state, activeChat: action.payload };
    case REMOVE_ACTIVE_CHAT:
      return { ...state, activeChat: null };
    case ADD_MESSAGE_TO_ACTIVE_CHAT:
      let chat: ActiveChatMessages | null = cloneDeep(state.activeChat);
      if (!chat) {
        chat = { messages: [] };
      }
      chat.messages = action.payload.concat(chat.messages);
      console.log(chat.messages);
      return { ...state, activeChat: chat };
    default:
      return state;
  }
};
