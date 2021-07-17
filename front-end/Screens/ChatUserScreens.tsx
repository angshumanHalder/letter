import React, { useEffect, useState } from "react";
import { BottomNavigation } from "react-native-paper";
import { useGetContacts } from "../hooks/useGetContacts";
import { ChatFeed } from "./ChatFeed";
import { Users } from "./Users";
import { useAppDispatch, useAppSelector } from "../hooks/reducerHooks";
import { getContacts, saveLocalContactsToStore } from "../actions/users";
import { getValueFor, save } from "../utils/secureStorage";
import { PRIVATE_KEY, PUBLIC_KEY, USERS } from "../utils/constants";

export const ChatUserScreens = () => {
  const contacts = useAppSelector((state) => state.contacts.contacts);
  const [index, setIndex] = useState(0);
  const phoneContacts = useGetContacts();
  const dispatch = useAppDispatch();
  const [routes] = useState([
    { key: "chats", title: "Chats", icon: "message" },
    { key: "users", title: "Contacts", icon: "account-group" },
  ]);

  useEffect(() => {
    if (phoneContacts) {
      const phoneNumbers = Object.keys(phoneContacts);
      dispatch(getContacts({ phones: phoneNumbers }));
    }
  }, [phoneContacts]);

  useEffect(() => {
    if (contacts && phoneContacts) {
      const matchedContacts: LocalContact[] = [];
      for (let contact of contacts) {
        matchedContacts.push({
          name: phoneContacts[contact.Phone],
          ...contact,
        });
      }
      dispatch(saveLocalContactsToStore(matchedContacts));
      (async function () {
        await save(USERS, JSON.stringify(matchedContacts));
      })();
    }
  }, [contacts]);

  const renderScene = BottomNavigation.SceneMap({
    chats: ChatFeed,
    users: Users,
  });
  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};
