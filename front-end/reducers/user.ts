import { AnyAction, Reducer } from "redux";
import {
  GET_CONTACTS,
  GET_CONTACTS_FAILED,
  SAVE_LOCAL_CONTACTS_TO_STORE,
} from "../actions/users";

type UserState = {
  contacts: null | ContactObj[];
  fetchContactsFailed: null | string;
  localContacts: LocalContact[] | [];
};

export const initialState: UserState = {
  contacts: null,
  fetchContactsFailed: null,
  localContacts: [],
};

export const userReducer: Reducer<UserState> = (
  state = initialState,
  action: AnyAction
) => {
  switch (action.type) {
    case GET_CONTACTS:
      return { ...state, contacts: action.payload, fetchContactsFailed: null };
    case GET_CONTACTS_FAILED:
      return { ...state, contacts: null, fetchContactsFailed: action.payload };
    case SAVE_LOCAL_CONTACTS_TO_STORE:
      return { ...state, localContacts: action.payload };
    default:
      return state;
  }
};
