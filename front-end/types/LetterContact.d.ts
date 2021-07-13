interface ContactObj {
  Id: string;
  Username: string;
  Phone: string;
}

interface LocalContacts extends ContactObj {
  name: string;
}
