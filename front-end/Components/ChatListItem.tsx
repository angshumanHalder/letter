import React from "react";
import { TouchableHighlight, View } from "react-native";
import ChatStyles from "../styles/ChatStyles";
import { Avatar, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

interface ChatListItemProps {
  item: ChatItem;
  onClick: () => void;
}

export const ChatListItem: React.FC<ChatListItemProps> = ({
  item,
  onClick,
}) => {
  const navigation = useNavigation();
  return (
    <TouchableHighlight
      activeOpacity={0.8}
      onPress={() => {
        onClick();
        navigation.navigate("Chat");
      }}
      style={ChatStyles.card}
      underlayColor="#E3E3E1"
    >
      <View style={ChatStyles.userInfo}>
        <View style={ChatStyles.userImgWrapper}>
          <Avatar.Text
            size={50}
            label={item.userName && item.userName[0].toUpperCase()}
          />
        </View>
        <View style={ChatStyles.textSection}>
          <View style={ChatStyles.userInfoText}>
            <Text style={ChatStyles.userName}>{item.userName}</Text>
            {item.new && <MaterialCommunityIcons name="circle" />}
          </View>
          <Text style={ChatStyles.messageText}>{item.messageText}</Text>
        </View>
      </View>
    </TouchableHighlight>
  );
};
