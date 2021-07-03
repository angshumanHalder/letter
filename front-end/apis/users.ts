import { GET_USERS } from "./Urls";
import axios from "axios";
import { getValueFor } from "../utils/secureStorage";
import { TOKEN } from "../utils/constants";

export const getUsersApi = async (
  contacts: ContactsRequest
): Promise<ResponseData> => {
  try {
    const token = await getValueFor(TOKEN);
    const res = await axios.post(GET_USERS(), contacts, {
      headers: {
        Authorization: `bearer ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    return err;
  }
};
