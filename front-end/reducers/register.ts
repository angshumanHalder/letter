import { AnyAction } from "redux";
import { REGISTER_USER, REGISTER_USER_FAILED } from "../actions/register";

type RegisterState = {
  success: boolean;
  registerError: null | string;
};

export const initialState: RegisterState = {
  success: false,
  registerError: null,
};

export const registerReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case REGISTER_USER:
      return { ...state, success: true, registerError: null };
    case REGISTER_USER_FAILED:
      return { ...state, success: false, registerError: action.payload };
    default:
      return state;
  }
};
