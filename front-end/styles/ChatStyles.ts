import { StyleSheet } from "react-native";
import { theme } from "../CustomProperties/Theme";

export default StyleSheet.create({
  container: {
    // View
    flex: 1,
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: "center",
    backgroundColor: theme.colors.white,
  },
  card: {
    // Touchable capacity
    width: "100%",
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
    width: 300,
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
    fontSize: 12,
    color: theme.colors.greyDark,
  },
  postTime: {
    // text
    fontSize: 12,
    color: theme.colors.greyDark,
  },
  messageText: {
    // text
    fontSize: 14,
    color: theme.colors.primary,
  },
});
