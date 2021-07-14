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

type ChatItem = {
  id: string;
  userName: string;
  messageText: MessageContent;
  new: boolean;
};

type Chat = {
  [key: string]: ActiveChatMessages | null;
};

type ActiveChatMessages = {
  messages: any[];
  new: boolean;
};
