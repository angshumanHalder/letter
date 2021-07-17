import { setupSocketConnection } from "../apis/chat";
import { AppDispatch, RootState } from "../configureStore";
import { CHATS, PRIVATE_KEY, PUBLIC_KEY } from "../utils/constants";
import { getValueFor } from "../utils/secureStorage";
// @ts-ignore
import RSAKey from "react-native-rsa";

export const SET_ACTIVE_CHAT_USER_ID = "SET_ACTIVE_CHAT_USER_ID";
export const REMOVE_ACTIVE_CHAT_USER_ID = "REMOVE_ACTIVE_CHAT_USER_ID";
export const SET_ACTIVE_CHAT_USER_ENCRYPTION_kEY =
  "SET_ACTIVE_CHAT_USER_ENCRYPTION_kEY";
export const REMOVE_ACTIVE_CHAT_USER_ENCRYPTION_kEY =
  "REMOVE_ACTIVE_CHAT_ENCRYPTION_kEY";
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

export const createSocketConnection = async (dispatch: AppDispatch) => {
  connection = await setupSocketConnection();
  connection.onopen = () => {
    console.log("connection set up success");
  };
  connection.onmessage = async (event: WebSocketMessageEvent) => {
    try {
      const socketPayload: SocketMessage = JSON.parse(event.data);
      switch (socketPayload.eventName) {
        case "message response":
          if (!socketPayload.eventPayload) {
            return;
          }
          const rsa = new RSAKey();
          const privateKey = await getValueFor(PRIVATE_KEY);
          rsa.setPrivateString(privateKey);
          const message: MessageContent = socketPayload.eventPayload.message;
          const decryptedMessage = rsa.decrypt(message.text);
          console.log(decryptedMessage);
          const sentBy = message.user._id;
          dispatch(
            addMessage(sentBy, [{ ...message, text: decryptedMessage }])
          );
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
  return async function (dispatch: AppDispatch, getState: () => RootState) {
    if (connection) {
      const { chat } = getState();
      const rsa = new RSAKey();
      rsa.setPublicString(chat.encryptionKey);
      const encryptedMessage = rsa.encrypt(messageContent[0].text);
      const message: SocketMessage = {
        eventName: "message",
        eventPayload: {
          to: activeChatUserId,
          message: { ...messageContent[0], text: encryptedMessage },
        },
      };
      connection.send(JSON.stringify(message));
      dispatch(addMessage(message.eventPayload.to, messageContent));
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

export const setEncryptionKey = (key: string) => {
  return function (dispatch: AppDispatch) {
    console.log("encryption key", key);
    dispatch({
      type: SET_ACTIVE_CHAT_USER_ENCRYPTION_kEY,
      payload: key,
    });
  };
};

export const removeEncryptionKey = () => {
  return function (dispatch: AppDispatch) {
    dispatch({
      type: REMOVE_ACTIVE_CHAT_USER_ENCRYPTION_kEY,
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
  messageContent: MessageContent[]
) => {
  return async function (
    dispatch: AppDispatch,
    getState: () => RootState
  ): Promise<void> {
    const { chat } = getState();
    if (chatUserId === chat.activeChatUserId) {
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
