import useSetState from "react-use/lib/useSetState";
import { createContainer } from "unstated-next";
import { MapTypes } from "react-native-maps";
import { DefaultLatDelta, DefaultLongDelta } from "../utils/Constants";
import { LitterPin } from "../services/api/Client";
import firebase from "firebase";

interface Reigon {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

interface MapState {
  markers: LitterPin[];
  location: Reigon;
  mapLoading: boolean;
  mapType: MapTypes;
  selectedMarker?: LitterPin;
}

const useMapState = () => {
  const [mapState, setMap] = useSetState<MapState>({
    location: {
      latitude: 50.7192,
      longitude: 1.8808,
      latitudeDelta: DefaultLatDelta,
      longitudeDelta: DefaultLongDelta,
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

  const newPinsRequiringPhotos = mapState.markers.filter(x => x.imageUrls === undefined);

  const currentUserUid = firebase.auth().currentUser?.uid;

  const markersForUser = () => mapState.markers.filter(marker => marker.createdByUid === currentUserUid || marker.lastUpdatedByUid === currentUserUid)

  const otherPeoplesMarkers = () => mapState.markers.filter(marker => marker.createdByUid !== currentUserUid && marker.lastUpdatedByUid !== currentUserUid)

  return {
    mapState,
    setMapState,
    newPinsRequiringPhotos,
    markersForUser,
    otherPeoplesMarkers
  };
};

export const MapContainer = createContainer(useMapState);
