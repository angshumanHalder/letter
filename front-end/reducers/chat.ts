import { AnyAction } from "redux";
import {
  REMOVE_ACTIVE_CHAT_USER_ID,
  SET_ACTIVE_CHAT,
  REMOVE_ACTIVE_CHAT,
  FETCH_ALL_CHATS_FROM_STORAGE_SUCCESS,
  FETCH_ALL_CHATS_FROM_STORAGE_ERROR,
  SET_ACTIVE_CHAT_USER_ID,
  ADD_MESSAGE_TO_ACTIVE_CHAT,
  CHAT_CLEAN_UP_UPON_UNMOUNT,
  ADD_MESSAGE_TO_OTHER_CHAT,
} from "../actions/chat";
import cloneDeep from "clone-deep";
import { Reducer } from "redux";

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

export const chatReducer: Reducer<ChatState> = (
  state = initialState,
  action: AnyAction
) => {
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
      return { ...state, activeChat: cloneDeep(action.payload) };
    case REMOVE_ACTIVE_CHAT:
      return { ...state, activeChat: null };
    case ADD_MESSAGE_TO_ACTIVE_CHAT:
      let chat: ActiveChatMessages | null = cloneDeep(state.activeChat);
      if (!chat) {
        chat = { messages: [] };
      }
      chat.messages = action.payload.concat(chat.messages);
      return { ...state, activeChat: chat };
    case ADD_MESSAGE_TO_OTHER_CHAT:
      let allChats: Chat | null = cloneDeep(state.chats);
      if (!allChats) {
        allChats = {
          [action.payload.chatUserId]: {
            messages: [],
          },
        };
      } else if (allChats && !allChats[action.payload.chatUserId]) {
        allChats = {
          ...allChats,
          [action.payload.chatUserId]: {
            messages: [],
          },
        };
      }
      allChats[action.payload.chatUserId]!.messages =
        action.payload.messageContent.concat(
          allChats[action.payload.chatUserId]!.messages
        );
      return {
        ...state,
        chats: allChats,
      };
    case CHAT_CLEAN_UP_UPON_UNMOUNT:
      let chats: Chat | null = cloneDeep(state.chats);
      if (!chats) {
        chats = {};
      }
      chats[state.activeChatUserId as string] = state.activeChat;
      return {
        ...state,
        activeChatUserId: null,
        activeChat: null,
        chats: chats,
      };
    default:
      return state;
  }
};
