export const BASE_URL = "http://192.168.0.103:4000";
export const SOCKET_URL = "ws://192.168.0.103:4000/user/ws";
//export const BASE_URL = "http://localhost:4000";

export const GET_USER = (params: any) => BASE_URL + `/user/${params.username}`;
export const GET_USERS = () => BASE_URL + `/user/contacts`;
export const REGISTER = () => BASE_URL + `/user`;
export const VERIFY_OTP = () => BASE_URL + `/user/verify`;
export const REQUEST_OTP = () => BASE_URL + `/user/otp`;
export const SAVE_PUBLIC_kEY = () => BASE_URL + "/user/save-key";
