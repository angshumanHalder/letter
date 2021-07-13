import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { setupSocketConnection } from "../apis/chat";
import { AppDispatch, RootState } from "../configureStore";
import { CHATS } from "../utils/constants";
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
export const CHAT_CLEAN_UP_UPON_UNMOUNT = "CHAT_CLEAN_UP_UPON_UNMOUNT";

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
          console.log("on message response", messageContent);
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
  messageContent: MessageContent[]
) => {
  return async function (dispatch: AppDispatch) {
    if (connection) {
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
    dispatch({
      type: SET_ACTIVE_CHAT_USER_ID,
      payload: userId,
    });
  };
};

export const removeActiveChatUserId = () => {
  return function (dispatch: AppDispatch) {
    dispatch({
      type: REMOVE_ACTIVE_CHAT_USER_ID,
    });
  };
};

export const setActiveChat = (activeChat: ActiveChatMessages) => {
  return function (dispatch: AppDispatch) {
    dispatch({
      type: SET_ACTIVE_CHAT,
      payload: activeChat,
    });
  };
};

export const removeActiveChat = () => {
  return function (dispatch: AppDispatch) {
    dispatch({
      type: REMOVE_ACTIVE_CHAT,
    });
  };
};

export const addMessage = (
  chatUserId: string,
  activeChatUserId: string | null,
  messageContent: MessageContent[]
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
      chat.activeChatUserId,
      messageContent
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
        payload: {
          chatUserId,
          messageContent,
        },
      });
    }
  };
};

export const chatCleanUpOnUnMount = () => {
  return function (dispatch: AppDispatch) {
    console.log("chat cleanup");
    dispatch({
      type: CHAT_CLEAN_UP_UPON_UNMOUNT,
    });
  };
};
