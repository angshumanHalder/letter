import * as SecureStore from "expo-secure-store";

export async function save(key: string, value: string): Promise<void> {
  await SecureStore.setItemAsync(key, value);
}

export async function getValueFor(key: string): Promise<string | null> {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    return result;
  }
  return null;
}
