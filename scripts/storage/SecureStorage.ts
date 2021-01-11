/* 
  SecureStorage.ts
  A typed generic wrapper for expo-secure-storage to allow for easy storage and retrieval of any interface or type.
  Not currently used in this app but I had planned to and didn't want to lose this... 
*/

import * as SecureStore from "expo-secure-store";

export const IsAvailable = async () => await SecureStore.isAvailableAsync();

export const DeleteItem = async (Key: string) =>
  await SecureStore.deleteItemAsync(Key);

export async function SetItem<T>(key: string, value: T) {
  try {
    if (value === null || value === undefined) return;
    await SecureStore.setItemAsync(key, JSON.stringify(value));
  } catch (e) {
    throw new Error();
  }
}

export async function GetItem<T>(key: string): Promise<T | null> {
  try {
    var jsonValue = await SecureStore.getItemAsync(key);
    return jsonValue !== null && jsonValue !== undefined
      ? (JSON.parse(jsonValue) as T)
      : null;
  } catch (e) {
    throw new Error();
  }
}
