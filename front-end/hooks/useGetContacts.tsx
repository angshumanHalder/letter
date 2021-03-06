import { useEffect, useState } from "react";
import * as Contacts from "expo-contacts";
import { contactMappingObject } from "../utils/createContactObjectMapping";

type ContactState = Record<string, string> | null;

export const useGetContacts = (): ContactState => {
  const [contacts, setContacts] = useState<ContactState>(null);
  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [
            Contacts.Fields.Name,
            Contacts.Fields.PhoneNumbers,
            Contacts.Fields.ID,
            Contacts.Fields.Image,
          ],
        });
        if (data.length > 0) {
          const mappedContacts = contactMappingObject(data);
          setContacts(mappedContacts);
        }
      }
    })();
  }, []);
  return contacts;
};
