import { configureFonts, DefaultTheme } from "react-native-paper";
import { fontConfig } from "./Fonts";

export const theme = {
  ...DefaultTheme,
  fonts: configureFonts(fontConfig),
  colors: {
    ...DefaultTheme.colors,
    primary: "#505050",
    secondary: "#BDBDC7",
    white: "#FDFDFD",
    grey: "#ECECEA",
    greySecondary: "#E3E3E1",
    greyDark: "#666666",
    blue: "#2196f3",
  },
};
