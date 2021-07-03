import { getUsersApi } from "../apis/users";
import { AppDispatch } from "../configureStore";

export const GET_CONTACTS = "GET_CONTACTS";
export const GET_CONTACTS_FAILED = "GET_CONTACTS_FAILED";

export const getContacts = (payload: ContactsRequest) => {
  return async function (dispatch: AppDispatch) {
    try {
      const res = await getUsersApi(payload);
      dispatch({
        type: GET_CONTACTS,
        payload: res.Data,
      });
    } catch (err) {
      dispatch({
        type: GET_CONTACTS_FAILED,
        payload: "Could not fetch users.",
      });
    }
  };
};
