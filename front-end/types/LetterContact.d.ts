interface ContactObj {
  Id: string;
  Username: string;
  Phone: string;
  PublicKey: string;
}

interface LocalContact extends ContactObj {
  name: string;
}
