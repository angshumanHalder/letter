import { AnyAction } from "redux";
import { GET_CONTACTS, GET_CONTACTS_FAILED } from "../actions/users";

type UserState = {
  contacts: null | string[];
  fetchContactsFailed: null | string;
};

export const initialState: UserState = {
  contacts: null,
  fetchContactsFailed: null,
};

export const contactsReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case GET_CONTACTS:
      return { ...state, contacts: action.payload, fetchContactsFailed: null };
    case GET_CONTACTS_FAILED:
      return { ...state, contacts: null, fetchContactsFailed: action.payload };
    default:
      return state;
  }
};
