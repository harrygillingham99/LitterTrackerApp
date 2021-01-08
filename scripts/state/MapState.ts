import useSetState from "react-use/lib/useSetState";
import { createContainer } from "unstated-next";
import { MapTypes } from "react-native-maps";
import { DefaultLatDelta, DefaultLongDelta } from "../utils/Constants";
import { LitterPin } from "../services/api/Client";
import firebase from "firebase";
import { GetData, StoreData } from "../storage/Storage";
import { MapTypeKey } from "../storage/StorageKeys";

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
}

const useMapState = () => {
  const [mapState, setMap] = useSetState<MapState>({
    location: {
      latitude: 50.72123099459833,
      longitude: -1.8765086308121681,
      latitudeDelta: 0.0717708440848881,
      longitudeDelta: 0.0630741566419597,
    },
    markers: [],
    mapLoading: false,
    mapType: "standard",
    selectedMarker: undefined,
  });

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

  const saveMapTypeSelection = (type: MapTypes) => {
    (async () => {
      await StoreData<MapTypes>(type, MapTypeKey);
    })();
  };

  const markersForUser = () =>
    mapState.markers.filter(
      (marker) =>
        marker.createdByUid === currentUserUid ||
        marker.lastUpdatedByUid === currentUserUid
    );

  const otherPeoplesMarkers = () =>
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
  };
};

export const MapContainer = createContainer(useMapState);
