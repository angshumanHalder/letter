import React from "react";
import { Register } from "./Screens/Register";
import { ChatUserScreens } from "./Screens/ChatUserScreens";
import { NavigationContainer } from "@react-navigation/native";
import { Otp } from "./Screens/Otp";
import { createStackNavigator } from "@react-navigation/stack";
import { StackParamsList } from "./types/navigationtypes";
import { Chat } from "./Screens/Chat";
import { useEffect } from "react";
import { useState } from "react";
import { getValueFor } from "./utils/secureStorage";
import { TOKEN } from "./utils/constants";

const Stack = createStackNavigator<StackParamsList>();

export const Navigation: React.FC<{}> = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    (async () => {
      if (await getValueFor(TOKEN)) {
        setIsLoggedIn(true);
      }
    })();
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <>
            <Stack.Screen name="ChatAndUserFeed" component={ChatUserScreens} />
            <Stack.Screen name="Chat" component={Chat} />
          </>
        ) : (
          <>
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="OTP" component={Otp} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
