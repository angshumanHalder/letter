import React from "react";
import { Register } from "./Screens/Register";
import { ChatUserScreens } from "./Screens/ChatUserScreens";
import { NavigationContainer } from "@react-navigation/native";
import { Otp } from "./Screens/Otp";
import { createStackNavigator } from "@react-navigation/stack";
import { StackParamsList } from "./types/navigationtypes";
import { Chat } from "./Screens/Chat";

const Stack = createStackNavigator<StackParamsList>();

export const Navigation: React.FC<{}> = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="ChatAndUserFeed" component={ChatUserScreens} />
        <Stack.Screen name="OTP" component={Otp} />
        <Stack.Screen name="Chat" component={Chat} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
