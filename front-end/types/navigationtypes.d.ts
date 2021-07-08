import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type StackParamsList = {
  Register: undefined;
  ChatAndUserFeed: undefined;
  OTP: undefined;
  ChatFeed: undefined;
  Chat: undefined;
};

type RouteStackParamsList = {
  Chat: { userId: string };
};

type ChatScreenRouteProp = RouteProp<RouteStackParamsList, "Chat">;

type RegisterNavigationProp = StackNavigationProp<StackParamsList, "Register">;

type OtpNavigationProp = StackNavigationProp<StackParamsList, "OTP">;
