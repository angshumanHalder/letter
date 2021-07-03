import { AnyAction } from "redux";
import {
  OTP_VERIFICATION_FAILED,
  OTP_VERIFICATION_SUCCESS,
  REGISTER_USER,
  REGISTER_USER_FAILED,
  OTP_REQUEST_FAILED,
  OTP_REQUEST_SUCCESS,
} from "../actions/register";

type RegisterState = {
  success: boolean;
  registerError: null | string;
  verificationSuccess: boolean;
  verificationFailed: null | string;
  otpRequestSuccess: boolean;
  otpRequestFailed: null | string;
};

export const initialState: RegisterState = {
  success: false,
  registerError: null,
  verificationSuccess: false,
  verificationFailed: null,
  otpRequestFailed: null,
  otpRequestSuccess: false,
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
    case OTP_REQUEST_FAILED:
      return {
        ...state,
        otpRequestSuccess: false,
        otpRequestFailed: action.payload,
      };
    case OTP_REQUEST_SUCCESS:
      return {
        ...state,
        otpRequestFailed: null,
        otpRequestSuccess: true,
      };
    default:
      return state;
  }
};
