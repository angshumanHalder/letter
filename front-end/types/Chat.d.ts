type SocketMessage = {
  eventName: string;
  eventPayload: {
    to: string;
    message: MessageContent;
  };
};

type MessageContent = {
  _id: string;
  createdAt: Date;
  text: string;
  user: {
    _id: string;
  };
};

type ChatUser = {
  id: string;
  userName: string;
  messageText: string;
};

type Chat = {
  [key: string]: {
    userId: string;
    messages: any[];
  };
};

type ActiveChatMessages = {
  messages: any[];
};
