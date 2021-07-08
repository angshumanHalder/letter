import { setupSocketConnection } from "../apis/chat";
import { AppDispatch } from "../configureStore";

export const SOCkET_CONNECT_SUCCESS = "SOCkET_CONNECT_SUCCESS";
export const SOCkET_CONNECT_FAILED = "SOCkET_CONNECT_FAILED";

export const createSocketConnection = () => {
  return async function (dispatch: AppDispatch) {
    try {
      const connection = setupSocketConnection();
      dispatch({
        type: SOCkET_CONNECT_SUCCESS,
        payload: connection,
      });
    } catch (err) {
      dispatch({
        type: SOCkET_CONNECT_FAILED,
        payload: "Socket connection failed. Please try again",
      });
    }
  };
};
