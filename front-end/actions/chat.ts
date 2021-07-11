import { Action, ActionCreator, AnyAction } from "redux";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { setupSocketConnection } from "../apis/chat";
import { AppDispatch, RootState } from "../configureStore";
import { useAppDispatch, useAppSelector } from "../hooks/reducerHooks";
import { CHATS, ME } from "../utils/constants";
import { getValueFor } from "../utils/secureStorage";

export const SET_ACTIVE_CHAT_USER_ID = "SET_ACTIVE_CHAT_USER_ID";
export const REMOVE_ACTIVE_CHAT_USER_ID = "REMOVE_ACTIVE_CHAT_USER_ID";
export const SET_ACTIVE_CHAT = "SET_ACTIVE_CHAT";
export const REMOVE_ACTIVE_CHAT = "REMOVE_ACTIVE_CHAT";
export const FETCH_ALL_CHATS_FROM_STORAGE_SUCCESS =
  "FETCHED_ALL_CHATS_FROM_STORAGE_SUCCESS";
export const FETCH_ALL_CHATS_FROM_STORAGE_ERROR =
  "FETCHED_ALL_CHATS_FROM_STORAGE_ERROR";
export const ADD_MESSAGE_TO_ACTIVE_CHAT = "ADD_MESSAGE_TO_ACTIVE_CHAT";
export const ADD_MESSAGE_TO_OTHER_CHAT = "ADD_MESSAGE_TO_OTHER_CHAT";

let connection: WebSocket | null = null;

export const createSocketConnection = async (
  dispatch: AppDispatch,
  activeChatUserId: string | null
) => {
  connection = await setupSocketConnection();
  connection.onopen = () => {
    console.log("connection set up success");
  };
  connection.onmessage = (event: WebSocketMessageEvent) => {
    try {
      const socketPayload: SocketMessage = JSON.parse(event.data);
      switch (socketPayload.eventName) {
        case "message response":
          if (!socketPayload.eventPayload) {
            return;
          }
          const message = socketPayload.eventPayload.message;
          const sentBy = message.user._id;
          const messageContent = message;
          dispatch(addMessage(sentBy, activeChatUserId, [messageContent]));
          break;
        default:
          break;
      }
    } catch (err) {
      console.log(err);
    }
  };
};

export const sendMessage = (
  activeChatUserId: string,
  messageContent: [MessageContent]
) => {
  return async function (dispatch: AppDispatch) {
    if (connection) {
      // send message and add it to the active chat
      const message: SocketMessage = {
        eventName: "message",
        eventPayload: {
          to: activeChatUserId,
          message: messageContent[0],
        },
      };
      console.log("sending message");
      connection.send(JSON.stringify(message));
      dispatch(
        addMessage(
          messageContent[0].user._id,
          messageContent[0].user._id,
          messageContent
        )
      );
    }
  };
};

export const getChatsFromStorage = () => {
  return async function (dispatch: AppDispatch) {
    try {
      const chats = await getValueFor(CHATS);
      if (chats) {
        dispatch({
          type: FETCH_ALL_CHATS_FROM_STORAGE_SUCCESS,
          payload: JSON.parse(chats),
        });
      }
    } catch (err) {
      console.log(err);
      dispatch({
        type: FETCH_ALL_CHATS_FROM_STORAGE_ERROR,
        payload: "Could not retrive chats",
      });
    }
  };
};

export const setActiveChatUserId = (userId: string) => {
  return async function (dispatch: AppDispatch) {
    const activeChatUserId = userId;
    console.log("set active user id", userId);
    dispatch({
      type: SET_ACTIVE_CHAT_USER_ID,
      payload: activeChatUserId,
    });
  };
};

export const removeActiveChatUserId = () => {
  return async function (dispatch: AppDispatch) {
    dispatch({
      type: REMOVE_ACTIVE_CHAT_USER_ID,
    });
  };
};

export const setActiveChat = (activeChat: any[]) => {
  return async function (dispatch: AppDispatch) {
    dispatch({
      type: SET_ACTIVE_CHAT,
      payload: activeChat,
    });
  };
};

export const removeActiveChat = () => {
  return async function (dispatch: AppDispatch) {
    dispatch({
      type: REMOVE_ACTIVE_CHAT,
    });
  };
};

export const addMessage = (
  chatUserId: string,
  activeChatUserId: string | null,
  messageContent: [MessageContent]
) => {
  return async function (
    dispatch: ThunkDispatch<RootState, {}, AnyAction>,
    getState: () => RootState
  ): Promise<void> {
    const { chat } = getState();
    console.log(
      "add message",
      activeChatUserId === chatUserId,
      activeChatUserId,
      chatUserId,
      chat.activeChatUserId
    );
    if (
      activeChatUserId === chatUserId ||
      chatUserId === chat.activeChatUserId
    ) {
      dispatch({
        type: ADD_MESSAGE_TO_ACTIVE_CHAT,
        payload: messageContent,
      });
    } else {
      dispatch({
        type: ADD_MESSAGE_TO_OTHER_CHAT,
        payload: messageContent,
      });
    }
  };
};
