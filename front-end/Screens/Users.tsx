import React, { useEffect, useState } from "react";
import { FlatList, SafeAreaView } from "react-native";
import { getContacts } from "../actions/users";
import { CustomItem } from "../Components/Item";
import { useAppDispatch, useAppSelector } from "../hooks/reducerHooks";
import { useGetContacts } from "../hooks/useGetContacts";
import UserStyles from "../styles/Users";
import { STORAGE_USER_KEY } from "../utils/constants";
import { getValueFor, save } from "../utils/secureStorage";
import { showToast } from "../utils/toast";

interface UserProps {}

type ContactState = [ContactObj];

export const Users: React.FC<UserProps> = () => {
  const contacts = useAppSelector((state) => state.contacts.contacts);
  const fetchContactsFailed = useAppSelector(
    (state) => state.contacts.fetchContactsFailed
  );
  const dispatch = useAppDispatch();
  const phoneContacts = useGetContacts();
  const [contactState, setContacts] = useState<ContactState>();

  useEffect(() => {
    if (phoneContacts) {
      const phoneNumbers = Object.keys(phoneContacts);
      dispatch(getContacts({ phones: phoneNumbers }));
    }
  }, [phoneContacts]);

  useEffect(() => {
    console.log(contacts);
    if (contacts && phoneContacts) {
      const matchedContacts = [];
      for (let contact of contacts) {
        matchedContacts.push({
          name: phoneContacts[contact.Phone],
          ...contact,
        });
      }
      console.log(matchedContacts);
      (async function () {
        await save(STORAGE_USER_KEY, JSON.stringify(contacts));
        setContacts(matchedContacts as ContactState);
      })();
    }
  }, [contacts]);

  useEffect(() => {
    if (fetchContactsFailed) {
      (async function () {
        const storageContacts = await getValueFor(STORAGE_USER_KEY);
        if (storageContacts) {
          const json = JSON.parse(storageContacts);
          setContacts(json);
        }
        showToast(fetchContactsFailed);
      })();
    }
  }, [fetchContactsFailed]);

  return (
    <SafeAreaView style={UserStyles.container}>
      {contactState && (
        <FlatList
          data={contactState}
          keyExtractor={(item) => item.Id}
          renderItem={({ item }) => <CustomItem key={item.Id} item={item} />}
        />
      )}
    </SafeAreaView>
  );
};
