/* 
  Storage.ts
  A typed generic wrapper for react-native-async-storage/async-storage. 
  Allows easy storage and retrieval of typed objects. 
*/

import AsyncStorage from "@react-native-async-storage/async-storage";

export async function StoreData<T>(value: T, key: string): Promise<void> {
  try {
    if (value === null || value === undefined) return;
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    throw new Error();
  }
}

export async function GetData<T>(key: string): Promise<T | null> {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue !== null && jsonValue !== undefined
      ? (JSON.parse(jsonValue) as T)
      : null;
  } catch (e) {
    throw new Error();
  }
}

export const ClearAll = async () => {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    throw new Error();
  }
};

export const RemoveFew = async (keys: string[]) => {
  try {
    await AsyncStorage.multiRemove(keys);
  } catch (e) {
    throw new Error();
  }
};
