import * as SecureStore from "expo-secure-store";

export const IsAvailable = async () => await SecureStore.isAvailableAsync();

export const DeleteItem = async (Key: string) =>
  await SecureStore.deleteItemAsync(Key);

export async function SetItem<T>(Key: string, Value: T) {
  try {
    await SecureStore.setItemAsync(Key, JSON.stringify(Value));
  } catch (e) {
    throw new Error()
  }
}

export async function GetItem<T>(Key: string): Promise<T> {
  try {
    var result = await SecureStore.getItemAsync(Key);
    return result != null ? JSON.parse(result) : null;
  } catch (e) {
    throw new Error();
  }
}
