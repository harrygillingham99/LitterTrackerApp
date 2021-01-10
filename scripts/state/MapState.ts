import useSetState from "react-use/lib/useSetState";
import { createContainer } from "unstated-next";
import { MapTypes } from "react-native-maps";
import { LitterPin } from "../services/api/Client";
import firebase from "firebase";
import { GetData, StoreData } from "../storage/Storage";
import { LocationAccuracyKey, MapTypeKey } from "../storage/StorageKeys";
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

  const tryGetSavedMapType = () => {
    (async () => {
      const savedType = await GetData<MapTypes>(MapTypeKey);
      if (savedType === null) return;
      setMap({ mapType: savedType });
    })();
  };

  const tryGetSavedLocationAccuracy = () => {
    (async () =>{
      const savedItem = await GetData<LocationAccuracy>(LocationAccuracyKey);
      if(savedItem === null) return;
      setMap({locationAccuracy: savedItem});
    })();
  }

  const saveMapTypeSelection = (type: MapTypes) => {
    (async () => {
      await StoreData<MapTypes>(type, MapTypeKey);
    })();
  };

  const saveLocationAccuracy = (choice: LocationAccuracy) => {
    (async () => {
      await StoreData<LocationAccuracy>(choice, LocationAccuracyKey);
    })();
  };

  const markersForUser = 
    mapState.markers.filter(
      (marker) =>
        marker.createdByUid === currentUserUid ||
        marker.lastUpdatedByUid === currentUserUid
    );

  const otherPeoplesMarkers =
    mapState.markers.filter(
      (marker) =>
        marker.createdByUid !== currentUserUid &&
        marker.lastUpdatedByUid !== currentUserUid
    );

  return {
    mapState,
    setMapState,
    markersForUser,
    otherPeoplesMarkers,
    tryGetSavedMapType,
    saveMapTypeSelection,
    tryGetSavedLocationAccuracy,
    saveLocationAccuracy
  };
};

export const MapContainer = createContainer(useMapState);
