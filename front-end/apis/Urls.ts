export const BASE_URL = "http://192.168.0.107:4000";
//export const BASE_URL = "http://localhost:4000";

export const GET_USER = (params: any) => BASE_URL + `/user/${params.username}`;
export const GET_USERS = () => BASE_URL + `/user/contacts`;
export const REGISTER = () => BASE_URL + `/user`;
export const VERIFY_OTP = () => BASE_URL + `/user/verify`;
export const REQUEST_OTP = () => BASE_URL + `/user/otp`;
