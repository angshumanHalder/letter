export const BASE_URL = "http://192.168.0.103:8080";

export const GET_USER = (params: any) => BASE_URL + `/user/${params.username}`;
export const GET_USERS = () => BASE_URL + `/user/contacts/`;
export const REGISTER = () => BASE_URL + `/user`;
