import React from "react";
import { TouchableHighlight, View } from "react-native";
import ChatStyles from "../styles/ChatStyles";
import { Avatar, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

interface ChatListItemProps {
  item: ChatUser;
  onClick: () => void;
}

export const ChatListItem: React.FC<ChatListItemProps> = ({ item }) => {
  const navigation = useNavigation();
  return (
    <TouchableHighlight
      activeOpacity={0.8}
      onPress={() => navigation.navigate("Chat")}
      style={ChatStyles.card}
      underlayColor="#E3E3E1"
    >
      <View style={ChatStyles.userInfo}>
        <View style={ChatStyles.userImgWrapper}>
          <Avatar.Text size={50} label={"XX"} />
        </View>
        <View style={ChatStyles.textSection}>
          <View style={ChatStyles.userInfoText}>
            <Text style={ChatStyles.userName}>{item.userName}</Text>
          </View>
          <Text style={ChatStyles.messageText}>{item.messageText}</Text>
        </View>
      </View>
    </TouchableHighlight>
  );
};
