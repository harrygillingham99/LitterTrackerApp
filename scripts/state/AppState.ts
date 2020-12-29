import useSetState from "react-use/lib/useSetState";
import { createContainer } from "unstated-next";
import * as firebase from "firebase";
import React from "react";
import { LatLng, MapTypes } from "react-native-maps";
import { DefaultLatDelta, DefaultLongDelta } from "../utils/Constants";

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
  markers: LatLng[];
  location: Reigon;
  mapLoading: boolean;
  mapType: MapTypes;
}

const useAppState = () => {
  const [appState, setAppState] = useSetState<AppState>();
  const [mapState, setMapState] = useSetState<MapState>({
    location: {
      latitude: 50.7192,
      longitude: 1.8808,
      latitudeDelta: DefaultLatDelta,
      longitudeDelta: DefaultLongDelta,
    },
    markers: [],
    mapLoading: false,
    mapType: "standard"
  });
  const [token, setToken] = React.useState<string>("not-logged-in");

  const getJwtTokenForUser = () => {
    if (appState.user === null || appState.user === undefined) {
      return "not-logged-in";
    }

    appState.user.getIdToken().then((res) => setToken(res));
    return token;
  };
  return { appState, setAppState, getJwtTokenForUser, mapState, setMapState };
};

export const AppContainer = createContainer(useAppState);
