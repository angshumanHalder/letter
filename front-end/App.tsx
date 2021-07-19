import React from "react";
import { StatusBar } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { theme } from "./CustomProperties/Theme";
import { Provider } from "react-redux";
import { store } from "./configureStore";
import { Navigation } from "./Navigation";
import { useEffect } from "react";

export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <StatusBar />
        <Navigation />
      </PaperProvider>
    </Provider>
  );
}
