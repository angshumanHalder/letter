import axios from "axios";
import { PUBLIC_KEY } from "../utils/constants";
import { getValueFor } from "../utils/secureStorage";
import { REGISTER, REQUEST_OTP, VERIFY_OTP } from "./Urls";

export const registerUserApi = async (
  reqPayload: RegisterRequest
): Promise<ResponseData> => {
  try {
    const publicKey = await getValueFor(PUBLIC_KEY);
    const request = {
      ...reqPayload,
      publicKey,
    };
    const url = REGISTER();
    const res = await axios.post(url, request);
    const resData: ResponseData = res.data;
    return resData;
  } catch (err) {
    return err;
  }
};

export const verifyOtpApi = async (
  reqPayload: OtpRequest
): Promise<ResponseData> => {
  try {
    const url = VERIFY_OTP();
    const res = await axios.post(url, reqPayload);
    const resData: ResponseData = res.data;
    return resData;
  } catch (err) {
    return err;
  }
};

export const requestOtpApi = async (
  reqPayload: RequestOtpRequest
): Promise<ResponseData> => {
  try {
    const url = REQUEST_OTP();
    const res = await axios.post(url, reqPayload);
    const resData: ResponseData = res.data;
    return resData;
  } catch (err) {
    return err;
  }
};
