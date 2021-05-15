export const BASE_URL = "http://localhost:4000/";

export const GET_USER = (params: any) => BASE_URL + `/user/${params.username}`;
export const GET_USERS = () => BASE_URL + `/user/contacts/`;
