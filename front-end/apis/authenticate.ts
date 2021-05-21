import axios from "axios";
import { REGISTER } from "./Urls";

export type RequestBody = {
  username: string;
  phone: string;
};

export type ResponseData = {
  Message?: string;
  Errors?: string[];
  Success: boolean;
  Data?: any;
};

export const registerUserApi = async (
  reqPayload: RequestBody
): Promise<ResponseData> => {
  try {
    const url = REGISTER();
    const res = await axios.post(url, reqPayload);
    console.log("api callig");
    const resData: ResponseData = res.data;
    return resData;
  } catch (err) {
    return err;
  }
};
