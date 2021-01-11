/* 
  SettingsStorage.ts
  These functions handle storage and retrieval of my settings items.
  The set function that's passed in is then used to rehydrate the app's state.  
*/

import { LocationAccuracy } from "expo-location";
import { MapTypes } from "react-native-maps";
import { MapState } from "../state/MapState";
import { GetData, StoreData } from "./Storage";

export const MapTypeKey = "MapType";

export const LocationAccuracyKey = "LocationAccuracy";

export const tryGetSavedMapType = (
  setMap: (
    patch: Partial<MapState> | ((prevState: MapState) => Partial<MapState>)
  ) => void
) => {
  (async () => {
    const savedType = await GetData<MapTypes>(MapTypeKey);
    if (savedType === null) return;
    setMap({ mapType: savedType });
  })();
};

export const tryGetSavedLocationAccuracy = (
  setMap: (
    patch: Partial<MapState> | ((prevState: MapState) => Partial<MapState>)
  ) => void
) => {
  (async () => {
    const savedItem = await GetData<LocationAccuracy>(LocationAccuracyKey);
    if (savedItem === null) return;
    setMap({ locationAccuracy: savedItem });
  })();
};

export const saveMapTypeSelection = (type: MapTypes) => {
  (async () => {
    await StoreData<MapTypes>(type, MapTypeKey);
  })();
};

export const saveLocationAccuracy = (choice: LocationAccuracy) => {
  (async () => {
    await StoreData<LocationAccuracy>(choice, LocationAccuracyKey);
  })();
};
