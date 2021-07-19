import { PRIVATE_KEY, PUBLIC_KEY } from "./constants";
import { getValueFor, save } from "./secureStorage";
// @ts-ignore
import RSAKey from "react-native-rsa";

export const generateKeyPair = async (): Promise<string[]> => {
  const bits = 1024;
  const exponent = "10001"; // must be a string. This is hex string. decimal = 65537
  const rsa = new RSAKey();
  rsa.generate(bits, exponent);
  const publicKey = rsa.getPublicString(); // return json encoded string
  const privateKey = rsa.getPrivateString(); // return json encoded string
  console.log("generate key pair");
  console.log(publicKey);
  console.log();
  console.log(privateKey);
  await save(PRIVATE_KEY, privateKey);
  await save(PUBLIC_KEY, publicKey);
  return [publicKey, privateKey];
};
