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
