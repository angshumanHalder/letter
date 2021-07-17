import React from "react";
import { TouchableHighlight, View } from "react-native";
import ItemStyles from "../styles/Item";
import { useNavigation } from "@react-navigation/native";
import { Avatar, Text } from "react-native-paper";

interface ItemProps {
  item: LocalContact;
  onClick: () => void;
}

export const CustomItem: React.FC<ItemProps> = ({ item, onClick }) => {
  const navigation = useNavigation();
  return (
    <TouchableHighlight
      activeOpacity={0.8}
      onPress={() => {
        onClick();
        navigation.navigate({
          name: "Chat",
          params: {
            userId: item.Id,
          },
        });
      }}
      style={ItemStyles.card}
      underlayColor="#E3E3E1"
    >
      <View style={ItemStyles.userInfo}>
        <View style={ItemStyles.userImgWrapper}>
          <Avatar.Text
            size={50}
            label={item.name && item.name[0].toUpperCase()}
          />
        </View>
        <View style={ItemStyles.textSection}>
          <View style={ItemStyles.userInfoText}>
            <Text style={ItemStyles.userName}>{item.name}</Text>
          </View>
          <Text style={ItemStyles.messageText}>{item.Phone}</Text>
        </View>
      </View>
    </TouchableHighlight>
  );
};
