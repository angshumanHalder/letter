import { TOKEN } from "../utils/constants";
import { getValueFor } from "../utils/secureStorage";
import { SOCKET_URL } from "./Urls";

export const setupSocketConnection = async (): Promise<WebSocket> => {
  const token = await getValueFor(TOKEN);
  const connection = new WebSocket(`${SOCKET_URL}?token=${token}`);
  return connection;
};
