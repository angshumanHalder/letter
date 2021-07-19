type RegisterRequest = {
  username: string;
  phone: string;
};

type OtpRequest = {
  otp: string;
};

type ContactsRequest = {
  phones: string[];
};

type RequestOtpRequest = {
  phone: string;
};

type PublicKeyRequest = {
  publicKey: string;
};
