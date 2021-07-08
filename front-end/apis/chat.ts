import { SOCkET_URL } from "./Urls";

export const setupSocketConnection = (): WebSocket => {
  const connection = new WebSocket(SOCkET_URL);
  return connection;
};
