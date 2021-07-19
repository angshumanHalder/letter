import axios from "axios";
import { TOKEN } from "../utils/constants";
import { getValueFor } from "../utils/secureStorage";
import { SAVE_PUBLIC_kEY, SOCKET_URL } from "./Urls";

export const setupSocketConnection = async (): Promise<WebSocket> => {
  const token = await getValueFor(TOKEN);
  const connection = new WebSocket(`${SOCKET_URL}?token=${token}`);
  return connection;
};

export const savePublicKey = async (
  reqPayload: PublicKeyRequest
): Promise<ResponseData> => {
  try {
    const token = await getValueFor(TOKEN);
    const res = await axios.post(SAVE_PUBLIC_kEY(), reqPayload, {
      headers: {
        Authorization: `bearer ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    return err;
  }
};
