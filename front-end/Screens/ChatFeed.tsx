import React, { useEffect } from "react";
import { FlatList, SafeAreaView } from "react-native";
import {
  createSocketConnection,
  getChatsFromStorage,
  setActiveChat,
  setActiveChatUserId,
} from "../actions/chat";
import { ChatListItem } from "../Components/ChatListItem";
import { useAppDispatch, useAppSelector } from "../hooks/reducerHooks";
import ChatStyles from "../styles/ChatStyles";
import { ME } from "../utils/constants";
import { getValueFor } from "../utils/secureStorage";

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
  const { activeChatUserId, chats } = useAppSelector((state) => ({
    activeChatUserId: state.chat.activeChatUserId,
    chats: state.chat.chats,
  }));
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async function () {
      await createSocketConnection(dispatch, activeChatUserId);
      dispatch(getChatsFromStorage());
    })();
  }, []);

  const setActiveUser = (id: string) => {
    dispatch(setActiveChatUserId(id));
  };

  useEffect(() => {
    if (activeChatUserId && chats && chats.length) {
      dispatch(setActiveChat(chats[activeChatUserId].messages));
    }
  }, [activeChatUserId]);

  return (
    <SafeAreaView style={ChatStyles.container}>
      <FlatList
        data={Messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatListItem item={item} onClick={() => setActiveUser(item.id)} />
        )}
      />
    </SafeAreaView>
  );
};
