import React from "react";
import { FlatList, SafeAreaView } from "react-native";
import { getUsers } from "../apis/users";
import { CustomItem } from "../Components/Item";
import { useGetContacts } from "../hooks/useGetContacts";
import UserStyles from "../styles/Users";
//import { useQuery } from "react-query";

interface UserProps {}

export const Users: React.FC<UserProps> = () => {
  const contacts = useGetContacts();

  if (contacts) {
    getUsers(contacts);
  }

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
