type SocketMessage = {
  eventName: string;
  eventPayload: {
    userId: string;
    message: any;
  };
};

type Message = {
  id: string;
  userName: string;
  messageText: string;
};
