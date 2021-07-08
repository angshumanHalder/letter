import React from "react";
import { View, Text } from "react-native";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/reducerHooks";
import { createSocketConnection } from "../actions/chat";
import { showToast } from "../utils/toast";
import ChatStyles from "../styles/ChatStyles";
import { FlatList, SafeAreaView } from "react-native";
import { ChatListItem } from "../Components/ChatListItem";

interface ChatFeedProps {}

const Messages: Message[] = [
  {
    id: "1",
    userName: "Jenny Doe",
    messageText:
      "Hey there, this is my test for a post of my social app in React Native.",
  },
  {
    id: "2",
    userName: "John Doe",
    messageText:
      "Hey there, this is my test for a post of my social app in React Native.",
  },
  {
    id: "3",
    userName: "Ken William",
    messageText:
      "Hey there, this is my test for a post of my social app in React Native.",
  },
  {
    id: "4",
    userName: "Selina Paul",
    messageText:
      "Hey there, this is my test for a post of my social app in React Native.",
  },
  {
    id: "5",
    userName: "Christy Alex",
    messageText:
      "Hey there, this is my test for a post of my social app in React Native.",
  },
];

export const ChatFeed: React.FC<ChatFeedProps> = () => {
  // const { connection, connectionError } = useAppSelector((state) => ({
  //   connection: state.chat.connection,
  //   connectionError: state.chat.connectionError,
  // }));
  // const dispatch = useAppDispatch();

  // useEffect(() => {
  //   dispatch(createSocketConnection());
  // }, []);

  // useEffect(() => {
  //   if (connectionError) {
  //     showToast(connectionError);
  //   }
  // }, [connectionError]);

  // useEffect(() => {
  //   if (connection) {
  //     subscribeToSocket(connection);
  //   }
  // }, [connection]);

  // const subscribeToSocket = (connection: WebSocket) => {
  //   connection.onmessage = (event: WebSocketMessageEvent) => {
  //     try {
  //       const socketPayload: SocketMessage = JSON.parse(event.data);
  //       switch (socketPayload.eventName) {
  //         case "message response":
  //           if (!socketPayload.eventPayload) {
  //             return;
  //           }
  //           const message = socketPayload.eventPayload;
  //           const sentBy = message.userId;
  //           const messageContent = message.message;
  //           // logic to attach it to active user chat else create new active chat
  //           break;
  //         default:
  //           break;
  //       }
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  // };

  return (
    <SafeAreaView style={ChatStyles.container}>
      <FlatList
        data={Messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatListItem item={item} />}
      />
    </SafeAreaView>
  );
};
