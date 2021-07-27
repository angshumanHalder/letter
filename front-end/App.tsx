import React from "react";
import { StatusBar } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { theme } from "./CustomProperties/Theme";
import { Provider } from "react-redux";
import { store, persistor } from "./configureStore";
import { Navigation } from "./Navigation";
import { PersistGate } from "redux-persist/integration/react";

export default function App({ navigation }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider theme={theme}>
          <StatusBar />
          <Navigation />
        </PaperProvider>
      </PersistGate>
    </Provider>
  );
}
