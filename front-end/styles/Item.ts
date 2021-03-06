import { StyleSheet } from "react-native";
import { theme } from "../CustomProperties/Theme";

export default StyleSheet.create({
  card: {
    // Touchable capacity
    margin: 1,
    paddingLeft: 20,
    width: "100%",
    backgroundColor: theme.colors.white,
  },
  userInfo: {
    // view
    flexDirection: "row",
    justifyContent: "space-between",
  },
  userImgWrapper: {
    // view
    paddingTop: 15,
    paddingBottom: 15,
  },
  textSection: {
    // view
    flexDirection: "column",
    justifyContent: "center",
    padding: 15,
    paddingLeft: 0,
    marginLeft: 10,
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grey,
  },
  userInfoText: {
    // view
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  userName: {
    // text
    fontSize: 20,
    color: theme.colors.greyDark,
  },
  messageText: {
    // text
    fontSize: 14,
    color: theme.colors.primary,
  },
});
