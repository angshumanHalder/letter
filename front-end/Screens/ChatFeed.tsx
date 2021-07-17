import React, { useEffect, useState } from "react";
import { FlatList, SafeAreaView } from "react-native";
import {
  createSocketConnection,
  getChatsFromStorage,
  setActiveChat,
  setActiveChatUserId,
  setEncryptionKey,
} from "../actions/chat";
import { ChatListItem } from "../Components/ChatListItem";
import { useAppDispatch, useAppSelector } from "../hooks/reducerHooks";
import ChatStyles from "../styles/ChatStyles";

interface ChatFeedProps {}

export const ChatFeed: React.FC<ChatFeedProps> = () => {
  const { chats, localContacts } = useAppSelector((state) => ({
    activeChatUserId: state.chat.activeChatUserId,
    chats: state.chat.chats,
    localContacts: state.contacts.localContacts,
  }));
  const dispatch = useAppDispatch();

  const [messages, setMessages] = useState<ChatItem[]>();

  useEffect(() => {
    if (chats) {
      const messages = [];
      const keys = Object.keys(chats);
      const idToNameMapping: { [key: string]: { [key: string]: string } } = {};
      localContacts.forEach((contact) => {
        if (!idToNameMapping[contact.Id]) {
          idToNameMapping[contact.Id] = {
            name: contact.name,
            publicKey: contact.PublicKey,
          };
        }
      });
      for (let key of keys) {
        const message: ChatItem = {
          id: key,
          userName: idToNameMapping[key].name,
          messageText: chats[key]!.messages[0].text,
          new: chats[key]!.new,
          publicKey: idToNameMapping[key].publicKey,
        };
        messages.push(message);
        // console.log("chat feed chats", message, idToNameMapping[key]);
        // console.log("text of message", chats[key]?.messages, chats);
      }
      // console.log("chat feed", chats);
      setMessages(messages);
    }
  }, [chats]);

  useEffect(() => {
    (async function () {
      await createSocketConnection(dispatch);
      dispatch(getChatsFromStorage());
    })();
  }, []);

  const setActiveUser = (id: string, publicKey: string) => {
    dispatch(setActiveChatUserId(id));
    dispatch(setEncryptionKey(publicKey));
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
            <ChatListItem
              item={item}
              onClick={() => setActiveUser(item.id, item.publicKey)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
};
