import React, { useEffect, useState } from "react";
import { FlatList, SafeAreaView } from "react-native";
import {
  setActiveChat,
  setActiveChatUserId,
  setEncryptionKey,
} from "../actions/chat";
import { CustomItem } from "../Components/Item";
import { useAppDispatch, useAppSelector } from "../hooks/reducerHooks";
import UserStyles from "../styles/Users";
import { USERS } from "../utils/constants";
import { getValueFor } from "../utils/secureStorage";
import { showToast } from "../utils/toast";

interface UserProps {}

type ContactState = LocalContact[];

export const Users: React.FC<UserProps> = () => {
  const { localContacts, chats } = useAppSelector((state) => ({
    localContacts: state.contacts.localContacts,
    chats: state.chat.chats,
  }));
  const fetchContactsFailed = useAppSelector(
    (state) => state.contacts.fetchContactsFailed
  );
  const dispatch = useAppDispatch();
  const [contactState, setContacts] = useState<ContactState>();

  useEffect(() => {
    if (localContacts) {
      setContacts(localContacts as ContactState);
    }
  }, [localContacts]);

  useEffect(() => {
    if (fetchContactsFailed) {
      (async function () {
        const storageContacts = await getValueFor(USERS);
        if (storageContacts) {
          const json = JSON.parse(storageContacts);
          setContacts(json);
        }
        showToast(fetchContactsFailed);
      })();
    }
  }, [fetchContactsFailed]);

  const setActiveUser = (id: string, publicKey: string) => {
    dispatch(setActiveChatUserId(id));
    dispatch(setEncryptionKey(publicKey));
    if (chats && chats[id]) {
      dispatch(setActiveChat(chats![id]!));
    }
  };

  return (
    <SafeAreaView style={UserStyles.container}>
      {contactState && (
        <FlatList
          data={contactState}
          keyExtractor={(item) => item.Id}
          renderItem={({ item }) => (
            <CustomItem
              key={item.Id}
              item={item}
              onClick={() => setActiveUser(item.Id, item.PublicKey)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
};
