import React, { useEffect } from "react";
import { Text } from "react-native";
import { AppHeader } from "../components/nav/Header";
import { DrawerScreens } from "../types/nav/DrawerScreens";
import { Routes } from "../types/nav/Routes";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { AppLogoIcon } from "../components/AppLogoIcon";
import { AppContainer } from "../state/AppState";
import { IConfig, LitterTrackerAppClient } from "../services/api/Client";
import { MapContainer } from "../state/MapState";
import useSetState from "react-use/lib/useSetState";
import { MarkerOverlay } from "../components/MarkerOverlay";
import { ScrollView } from "react-native-gesture-handler";
import { Loader } from "../components/Loader";
import { PinRowItem } from "../components/PinRowItem";

type HomeScreenNavigationProp = DrawerNavigationProp<
  DrawerScreens,
  Routes.Home
>;

type HomeScreenProps = {
  navigation: HomeScreenNavigationProp;
};

export interface HomeScreenState {
  loading: boolean;
}

export const HomeScreen = (props: HomeScreenProps) => {
  const { appState } = AppContainer.useContainer();
  const {
    markersForUser,
    setMapState,
    otherPeoplesMarkers,
    mapState,
  } = MapContainer.useContainer();
  const [state, setState] = useSetState<HomeScreenState>({
    loading: false,
  });

  useEffect(() => {
    (async () => {
      setState({ loading: true });
      const token = (await appState.user.getIdToken()) ?? "not-logged-in";
      const client = new LitterTrackerAppClient(new IConfig(token));
      const markers = await client.getLitterPins();
      setMapState({ markers: markers });
      setState({ loading: false });
    })();
  }, [appState.user]);

  return (
    <>
      <AppHeader
        leftComponentOnPress={props.navigation.toggleDrawer}
        centerComponent={AppLogoIcon}
      />
      {state.loading && <Loader />}
      {!state.loading && (
        <>
          <ScrollView>
            {!appState.user.isAnonymous && <Text>Your Pins:</Text>}
            {!appState.user.isAnonymous &&
              markersForUser().map((marker) => (
                <PinRowItem
                  marker={marker}
                  setState={setMapState}
                  setHomeState={setState}
                />
              ))}
            <Text>Other Users Pins:</Text>
            {!appState.user.isAnonymous &&
              otherPeoplesMarkers().map((marker) => (
                <PinRowItem
                  marker={marker}
                  setState={setMapState}
                  setHomeState={setState}
                />
              ))}
            {appState.user.isAnonymous &&
              mapState.markers.map((marker) => (
                <PinRowItem
                  marker={marker}
                  setState={setMapState}
                  setHomeState={setState}
                />
              ))}
          </ScrollView>
          <MarkerOverlay selectedMarker={mapState.selectedMarker} />
        </>
      )}
    </>
  );
};
