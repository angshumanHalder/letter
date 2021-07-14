import React, { useEffect, useState } from "react";
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

interface ChatFeedProps {}

export const ChatFeed: React.FC<ChatFeedProps> = () => {
  const { activeChatUserId, chats, localContacts } = useAppSelector(
    (state) => ({
      activeChatUserId: state.chat.activeChatUserId,
      chats: state.chat.chats,
      localContacts: state.contacts.localContacts,
    })
  );
  const dispatch = useAppDispatch();

  const [messages, setMessages] = useState<ChatItem[]>();

  useEffect(() => {
    if (chats) {
      const messages = [];
      const keys = Object.keys(chats);
      const idToNameMapping: { [key: string]: string } = {};
      localContacts.forEach((contact) => {
        if (!idToNameMapping[contact.Id]) {
          idToNameMapping[contact.Id] = contact.name;
        }
      });
      for (let key of keys) {
        const message: ChatItem = {
          id: key,
          userName: idToNameMapping[key],
          messageText: chats[key]!.messages[0].text,
          new: chats[key]!.new,
        };
        messages.push(message);
        console.log("chat feed chats", message);
        console.log("text of message", chats[key]?.messages, chats);
      }
      console.log("chat feed", chats);
      setMessages(messages);
    }
  }, [chats]);

  useEffect(() => {
    (async function () {
      await createSocketConnection(dispatch, activeChatUserId);
      dispatch(getChatsFromStorage());
    })();
  }, []);

  const setActiveUser = (id: string) => {
    dispatch(setActiveChatUserId(id));
    console.log("active chat chat feed", chats![id]);
    dispatch(setActiveChat(chats![id]!));
  };

  return (
    <SafeAreaView style={ChatStyles.container}>
      {messages && (
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChatListItem item={item} onClick={() => setActiveUser(item.id)} />
          )}
        />
      )}
    </SafeAreaView>
  );
};
