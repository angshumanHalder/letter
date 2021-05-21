import React, { useState } from "react";
import { BottomNavigation } from "react-native-paper";
import { Chat } from "./Chat";
import { Users } from "./Users";

export const ChatUserScreens = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "chats", title: "Chats", icon: "message" },
    { key: "users", title: "Contacts", icon: "account-group" },
  ]);
  const renderScene = BottomNavigation.SceneMap({
    chats: Chat,
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
