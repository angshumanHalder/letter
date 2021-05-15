import { Contact, PhoneNumber } from "expo-contacts";
import { flatten } from "../utils/flattenArray";

export const getUsers = async (contacts: Contact[]) => {
  try {
    const phnNums = contacts.map((contact) => contact.phoneNumbers);
    const flattenedPhnNums = [...flatten(phnNums, 1)];
    const numbers = flattenedPhnNums.map((phnNum) => {
      return phnNum.number;
    });
    //const reqBody = {
    //numbers: flattendNumbers,
    //};
    //const res = await axios.post(GET_USERS(), reqBody);
  } catch (err) {}
};
