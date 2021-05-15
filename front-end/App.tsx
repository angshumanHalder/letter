import React, { useState } from "react";
import { StatusBar } from "react-native";
import {
  BottomNavigation,
  Provider as PaperProvider,
} from "react-native-paper";
import { theme } from "./CustomProperties/Theme";
import { Chat } from "./Screens/Chat";
import { Users } from "./Screens/Users";
import { QueryClientProvider, QueryClient } from "react-query";
import { Register } from "./Screens/Register";

const queryClient = new QueryClient();

export default function App() {
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
    <PaperProvider theme={theme}>
      <StatusBar />
      <Register />
      {/*
      <QueryClientProvider client={queryClient}>

        <BottomNavigation
          navigationState={{ index, routes }}
          onIndexChange={setIndex}
          renderScene={renderScene}
        />
      </QueryClientProvider>
          */}
    </PaperProvider>
  );
}
