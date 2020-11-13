import AsyncStorage from "@react-native-async-storage/async-storage";

export async function StoreData<T>(value: T, Key: string): Promise<void> {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(Key, jsonValue);
  } catch (e) {
    throw new Error();
  }
}

export async function GetData<T>(Key: string): Promise<T> {
  try {
    const jsonValue = await AsyncStorage.getItem(Key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
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
