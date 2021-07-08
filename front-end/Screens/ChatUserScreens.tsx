import React, { useState } from "react";
import { BottomNavigation } from "react-native-paper";
import { ChatFeed } from "./ChatFeed";
import { Users } from "./Users";

export const ChatUserScreens = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "chats", title: "Chats", icon: "message" },
    { key: "users", title: "Contacts", icon: "account-group" },
  ]);

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
