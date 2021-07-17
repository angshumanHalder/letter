import { PRIVATE_KEY, PUBLIC_KEY } from "./constants";
import { getValueFor, save } from "./secureStorage";
// @ts-ignore
import RSAKey from "react-native-rsa";

export const generateKeys = async () => {
  if ((await getValueFor(PRIVATE_KEY)) && (await getValueFor(PUBLIC_KEY))) {
    return;
  }
  const bits = 1024;
  const exponent = "10001"; // must be a string. This is hex string. decimal = 65537
  const rsa = new RSAKey();
  rsa.generate(bits, exponent);
  const publicKey = rsa.getPublicString(); // return json encoded string
  const privateKey = rsa.getPrivateString(); // return json encoded string
  await save(PRIVATE_KEY, privateKey);
  await save(PUBLIC_KEY, publicKey);
};
