//import React, { useEffect, useState } from "react";
import React from "react";
import { StatusBar } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { theme } from "./CustomProperties/Theme";
import { Register } from "./Screens/Register";
//import { getValueFor } from "./utils/secureStorage";
import { ChatUserScreens } from "./Screens/ChatUserScreens";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Otp } from "./Screens/Otp";
import { Provider } from "react-redux";
import { store } from "./configureStore";

export type StackParamsList = {
  Register: undefined;
  ChatAndUserFeed: undefined;
  OTP: undefined;
};

const Stack = createStackNavigator<StackParamsList>();

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

  const renderComp = () => {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="ChatAndUserFeed" component={ChatUserScreens} />
          <Stack.Screen name="OTP" component={Otp} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  };

  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <StatusBar />
        {renderComp()}
      </PaperProvider>
    </Provider>
  );
}
