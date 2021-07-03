import { ToastAndroid } from "react-native";

export const showToast = (message: string) => {
  return ToastAndroid.showWithGravity(
    message,
    ToastAndroid.LONG,
    ToastAndroid.CENTER
  );
};
