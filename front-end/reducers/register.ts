import { AnyAction } from "redux";
import {
  OTP_VERIFICATION_FAILED,
  OTP_VERIFICATION_SUCCESS,
  REGISTER_USER,
  REGISTER_USER_FAILED,
} from "../actions/register";

type RegisterState = {
  success: boolean;
  registerError: null | string;
  verificationSuccess: boolean;
  verificationFailed: null | string;
};

export const initialState: RegisterState = {
  success: false,
  registerError: null,
  verificationSuccess: false,
  verificationFailed: null,
};

export const registerReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case REGISTER_USER:
      return { ...state, success: true, registerError: null };
    case REGISTER_USER_FAILED:
      return { ...state, success: false, registerError: action.payload };
    case OTP_VERIFICATION_SUCCESS:
      return { ...state, verificationSuccess: true, verificationFailed: null };
    case OTP_VERIFICATION_FAILED:
      return {
        ...state,
        verificationSuccess: false,
        verificationFailed: action.paylod,
      };
    default:
      return state;
  }
};
