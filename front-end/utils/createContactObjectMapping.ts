import { Contact } from "expo-contacts";

export const contactMappingObject = (contacts: Contact[]) => {
  const contactsMap: Record<string, string> = {};
  for (let contact of contacts) {
    if (contact.phoneNumbers) {
      for (let phone of contact.phoneNumbers) {
        if (phone.number && !(phone.number in contactsMap)) {
          let num = phone.number.replace(/\D/g, "");
          if (num.length > 10) {
            num = num.slice(2);
          }
          contactsMap[num] = contact.name;
        }
      }
    }
  }
  return contactsMap;
};
