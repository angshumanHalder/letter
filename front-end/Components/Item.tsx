import React from "react";
import { TouchableHighlight, View, Text } from "react-native";
import ItemStyles from "../styles/Item";

interface ItemProps {
  item: ContactObj;
}

export const CustomItem: React.FC<ItemProps> = ({ item }) => {
  return (
    <TouchableHighlight
      activeOpacity={0.6}
      onPress={() => {
        console.log("hello");
      }}
    >
      <View style={ItemStyles.item}>
        <Text>{item.username}</Text>
      </View>
    </TouchableHighlight>
  );
};
