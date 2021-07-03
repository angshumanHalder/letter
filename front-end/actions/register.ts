import { registerUserApi, verifyOtpApi } from "../apis/authenticate";
import { AppDispatch } from "../configureStore";
import { TOKEN } from "../utils/constants";
import { save } from "../utils/secureStorage";

export const REGISTER_USER = "REGISTER_USER";
export const REGISTER_USER_FAILED = "REGISTER_USER_FAILED ";
export const OTP_VERIFICATION_SUCCESS = "OTP_VERIFICATION_SUCCESS";
export const OTP_VERIFICATION_FAILED = "OTP_VERIFICATION_FAILED";
export const OTP_REQUEST_SUCCESS = "OTP_REQUEST_SUCCESS";
export const OTP_REQUEST_FAILED = "OTP_REQUEST_FAILED";

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
      console.log(res);
      if (res.Success) {
        await save(TOKEN, res.Data);
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

export const requestOtp = (payload: RequestOtpRequest) {
 return async function(dispatch: AppDispatch)  {
   try {          
   } catch(err) {
     dispatch({
       type: OTP_REQUEST_FAILED,
       payload: "Could not request otp. Please try again in some time."
     })
   }
 }
}