import {
  registerUserApi,
  requestOtpApi,
  verifyOtpApi,
} from "../apis/authenticate";
import { savePublicKey } from "../apis/chat";
import { AppDispatch } from "../configureStore";
import { ME, PRIVATE_KEY, PUBLIC_KEY, TOKEN } from "../utils/constants";
import { generateKeyPair } from "../utils/pkGen";
import { getValueFor, save } from "../utils/secureStorage";

export const REGISTER_USER = "REGISTER_USER";
export const REGISTER_USER_FAILED = "REGISTER_USER_FAILED ";
export const OTP_VERIFICATION_SUCCESS = "OTP_VERIFICATION_SUCCESS";
export const OTP_VERIFICATION_FAILED = "OTP_VERIFICATION_FAILED";
export const OTP_REQUEST_SUCCESS = "OTP_REQUEST_SUCCESS";
export const OTP_REQUEST_FAILED = "OTP_REQUEST_FAILED";
export const SAVE_PUBLIC_KEY_SUCCESS = "SAVE_PUBLIC_KEY_SUCCESS";
export const SAVE_PUBLIC_KEY_ERROR = "SAVE_PUBLIC_KEY_ERROR";

export const registerUser = (payload: RegisterRequest) => {
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
        payload: "Some Error Occurred. Please try again",
      });
    }
  };
};

export const verifyOtp = (payload: OtpRequest) => {
  return async function (dispatch: AppDispatch) {
    try {
      const res = await verifyOtpApi(payload);
      if (res.Success) {
        await save(TOKEN, res.Data.Token);
        await save(ME, res.Data.UserId);
        dispatch({
          type: OTP_VERIFICATION_SUCCESS,
        });
      }
    } catch (err) {
      dispatch({
        type: OTP_VERIFICATION_FAILED,
        payload: "Could not verify otp. Please try again in some time.",
      });
    }
  };
};

export const requestOtp = (payload: RequestOtpRequest) => {
  return async function (dispatch: AppDispatch) {
    try {
      const res = await requestOtpApi(payload);
      if (res.Success) {
        dispatch({
          type: OTP_REQUEST_SUCCESS,
        });
      }
    } catch (err) {
      dispatch({
        type: OTP_REQUEST_FAILED,
        payload: "Could not request otp. Please try again in some time.",
      });
    }
  };
};

export const setPublicKey = () => {
  return async function (dispatch: AppDispatch) {
    try {
      if (await getValueFor(PRIVATE_KEY)) {
        console.log("returned");
        return;
      }
      const [publicKey, _] = await generateKeyPair();
      await savePublicKey({ publicKey });
      dispatch({
        type: SAVE_PUBLIC_KEY_SUCCESS,
      });
    } catch (err) {
      console.log(err);
      dispatch({
        type: SAVE_PUBLIC_KEY_ERROR,
      });
    }
  };
};
