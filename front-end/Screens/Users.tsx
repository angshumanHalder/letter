import { Contact } from "expo-contacts";
import React, { useEffect, useState } from "react";
import { FlatList, SafeAreaView } from "react-native";
import { getContacts } from "../actions/users";
import { CustomItem } from "../Components/Item";
import { useAppDispatch, useAppSelector } from "../hooks/reducerHooks";
import { useGetContacts } from "../hooks/useGetContacts";
import UserStyles from "../styles/Users";
import { STORAGE_USER_KEY } from "../utils/constants";
import { flatten } from "../utils/flattenArray";
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
      const phnNums = phoneContacts.map(
        (contact: Contact) => contact.phoneNumbers
      );
      const flattenedPhnNums = [...flatten(phnNums, 1)];
      const phones = flattenedPhnNums.filter((phnNum) => {
        if (phnNum?.number) {
          return String(phnNum.number);
        }
      });
      if (phones && phones.length > 0) {
        dispatch(getContacts({ phones }));
      }
    }
  }, [phoneContacts]);

  useEffect(() => {
    if (contacts) {
      (async function () {
        await save(STORAGE_USER_KEY, JSON.stringify(contacts));
        setContacts(contacts);
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
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <CustomItem item={item} />}
        />
      )}
    </SafeAreaView>
  );
};
