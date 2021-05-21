import React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface OtpProps {}

export const Otp: React.FC<OtpProps> = () => {
  return (
    <SafeAreaView>
      <Text>Otp Screen</Text>
    </SafeAreaView>
  );
};
