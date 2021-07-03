//import React, { useEffect, useState } from "react";
import React from "react";
import { StatusBar } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { theme } from "./CustomProperties/Theme";
//import { getValueFor } from "./utils/secureStorage";
import { Provider } from "react-redux";
import { store } from "./configureStore";
import { Navigation } from "./Navigation";

export default function App() {
  //const [isLoggedIn, setIsLoggedIn] = useState(false);

  //useEffect(() => {
  //(async () => {
  //const token = await getValueFor("token");
  //if (token) {
  //setIsLoggedIn(true);
  //}
  //})();
  //}, [isLoggedIn]);

  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <StatusBar />
        <Navigation />
      </PaperProvider>
    </Provider>
  );
}
