import useSetState from "react-use/lib/useSetState";
import { createContainer } from "unstated-next";
import * as firebase from "firebase";
import React from "react";
import { MapTypes } from "react-native-maps";
import { DefaultLatDelta, DefaultLongDelta } from "../utils/Constants";
import { LitterPin } from "../services/api/Client";

interface AppState {
  user: firebase.default.User;
}

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

const useAppState = () => {
  const [appState, setAppState] = useSetState<AppState>();
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
  const [token, setToken] = React.useState<string>("not-logged-in");

  const getJwtTokenForUser = () => {
    if (appState.user === null || appState.user === undefined) {
      return "not-logged-in";
    }
    appState.user.getIdToken().then((res) => setToken(res));
    return token;
  };

  const setMapState = (
    patch: Partial<MapState> | ((prevState: MapState) => Partial<MapState>)
  ) => {
    setMap(patch);
  };

  const newPinsRequiringPhotos = mapState.markers.filter(x => x.imageUrls === undefined);

  return {
    appState,
    setAppState,
    getJwtTokenForUser,
    mapState,
    setMapState,
    newPinsRequiringPhotos,
  };
};

export const AppContainer = createContainer(useAppState);
