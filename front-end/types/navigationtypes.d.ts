import { StackNavigationProp } from "@react-navigation/stack";

type StackParamsList = {
  Register: undefined;
  ChatAndUserFeed: undefined;
  OTP: undefined;
};

type RegisterNavigationProp = StackNavigationProp<StackParamsList, "Register">;

type OtpNavigationProp = StackNavigationProp<StackParamsList, "OTP">;
