import { StyleSheet } from "react-native";
import { theme } from "../CustomProperties/Theme";

export default StyleSheet.create({
  otpContainer: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
  input: {
    width: "70%",
    height: 50,
    margin: 16,
  },
  logo: {
    fontSize: 30,
    color: theme.colors.primary,
    marginTop: 100,
    marginBottom: 100,
  },
  button: {
    marginTop: 10,
  },
});
