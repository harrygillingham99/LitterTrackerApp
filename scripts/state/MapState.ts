/* 
  MapState.ts
  This is the global map state container used to handle all of the Map View's state. 
  Allowing it to be manipulated throughout the whole app.
  Unstated-next makes global state straightforward and makes custom hooks and functions to transform the state easy to implement. 
*/

import useSetState from "react-use/lib/useSetState";
import { createContainer } from "unstated-next";
import { MapTypes } from "react-native-maps";
import { LitterPin } from "../services/api/Client";
import firebase from "firebase";
import {
  tryGetSavedLocationAccuracy,
  tryGetSavedMapType,
} from "../storage/SettingsStorage";
import { InitialMapState } from "../utils/Constants";
import { LocationAccuracy } from "expo-location";

interface Reigon {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface MapState {
  markers: LitterPin[];
  location: Reigon;
  mapLoading: boolean;
  mapType: MapTypes;
  selectedMarker?: LitterPin;
  showInfoOverlay: boolean;
  locationAccuracy: LocationAccuracy;
}

const useMapState = () => {
  const [mapState, setMap] = useSetState<MapState>(InitialMapState);

  const setMapState = (
    patch: Partial<MapState> | ((prevState: MapState) => Partial<MapState>)
  ) => {
    setMap(patch);
  };

  const currentUserUid = firebase.auth().currentUser?.uid;

  const tryGetSettingsItemsFromStorage = () => {
    tryGetSavedLocationAccuracy(setMap);
    tryGetSavedMapType(setMap);
  };

  const markersForUser = mapState.markers.filter(
    (marker) =>
      marker.createdByUid === currentUserUid ||
      marker.lastUpdatedByUid === currentUserUid
  );

  const otherPeoplesMarkers = mapState.markers.filter(
    (marker) =>
      marker.createdByUid !== currentUserUid &&
      marker.lastUpdatedByUid !== currentUserUid
  );

  return {
    mapState,
    setMapState,
    markersForUser,
    otherPeoplesMarkers,
    tryGetSettingsItemsFromStorage,
  };
};

export const MapContainer = createContainer(useMapState);
