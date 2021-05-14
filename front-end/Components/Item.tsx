import React from "react";
import { TouchableHighlight, View, Text } from "react-native";
import ItemStyles from "../styles/Item";
import * as Contacts from "expo-contacts";

interface ItemProps {
  item: Contacts.Contact;
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
        <Text>{item.name}</Text>
      </View>
    </TouchableHighlight>
  );
};
