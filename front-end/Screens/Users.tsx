import React from "react";
import { FlatList, SafeAreaView } from "react-native";
import { CustomItem } from "../Components/Item";
import { useGetContacts } from "../hooks/useGetContacts";
import UserStyles from "../styles/Users";

interface UserProps {}

export const Users: React.FC<UserProps> = () => {
  const contacts = useGetContacts();
  return (
    <SafeAreaView style={UserStyles.container}>
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CustomItem item={item} />}
      />
    </SafeAreaView>
  );
};
