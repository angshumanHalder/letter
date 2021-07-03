import { StyleSheet } from "react-native";
import { theme } from "../CustomProperties/Theme";

export default StyleSheet.create({
  registerContainer: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
  subContainer: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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
  loginText: {
    fontSize: 16,
    marginTop: 15,
  },
  linkText: {
    color: theme.colors.blue,
  }
});
