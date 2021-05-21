import { registerUserApi } from "../apis/authenticate";
import { AppDispatch } from "../configureStore";

export const REGISTER_USER = "REGISTER_USER";
export const REGISTER_USER_FAILED = "REGISTER_USER_FAILED ";

export const registerUser = (payload: { username: string; phone: string }) => {
  return async function (dispatch: AppDispatch) {
    try {
      const res = await registerUserApi(payload);
      if (res.Success) {
        dispatch({
          type: REGISTER_USER,
        });
      }
    } catch (err) {
      dispatch({
        type: REGISTER_USER_FAILED,
        payload: err,
      });
    }
  };
};
