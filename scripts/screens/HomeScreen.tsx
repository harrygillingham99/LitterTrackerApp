import React, { useEffect, useRef } from "react";
import { Text, ScrollView } from "react-native";
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
import { Loader } from "../components/Loader";
import { PinRowItem } from "../components/PinRowItem";
import { Icon } from "react-native-elements";
import { AccountOverlay } from "../components/AccountOverlay";
import { useIsFocused } from "@react-navigation/native";

type HomeScreenNavigationProp = DrawerNavigationProp<
  DrawerScreens,
  Routes.Home
>;

type HomeScreenProps = {
  navigation: HomeScreenNavigationProp;
};

export interface HomeScreenState {
  loading: boolean;
  showAccountModal: boolean;
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
    showAccountModal: false,
  });

  const homeFocused = useIsFocused();

  useEffect(() => {
    (async () => {
      if (appState.user === undefined) return;
      setState({ loading: true });
      const token = (await appState.user.getIdToken()) ?? "not-logged-in";
      const client = new LitterTrackerAppClient(new IConfig(token));
      const markers = await client.getLitterPins();
      setMapState({ markers: markers });
      setState({ loading: false });
    })();
  }, [appState.user, homeFocused, mapState.selectedMarker]);

  return (
    <>
      <AppHeader
        leftComponentOnPress={props.navigation.toggleDrawer}
        centerComponent={AppLogoIcon}
        rightComponent={
          <Icon
            onPress={() => setState({ showAccountModal: true })}
            type="feather"
            name="user"
            color="white"
          ></Icon>
        }
      />
      {state.loading && <Loader />}
      {!state.loading && appState.user !== undefined && (
        <>
          <ScrollView style={{ height: "100%" }}>
            {!appState.user.isAnonymous && <Text>Your Pins:</Text>}
            {!appState.user.isAnonymous &&
              markersForUser.map((marker) => (
                <PinRowItem
                  key={`${marker.dataStoreId}-item`}
                  marker={marker}
                  setState={setMapState}
                  setHomeState={setState}
                />
              ))}
            <Text>Other Users Pins:</Text>
            {!appState.user.isAnonymous &&
              otherPeoplesMarkers.map((marker) => (
                <PinRowItem
                  key={`${marker.dataStoreId}-item`}
                  marker={marker}
                  setState={setMapState}
                  setHomeState={setState}
                />
              ))}
            {appState.user.isAnonymous &&
              mapState.markers.map((marker) => (
                <PinRowItem
                  key={`${marker.dataStoreId}-item`}
                  marker={marker}
                  setState={setMapState}
                  setHomeState={setState}
                />
              ))}
          </ScrollView>
          <MarkerOverlay />
          <AccountOverlay
            visible={state.showAccountModal}
            setHomeState={setState}
          />
        </>
      )}
    </>
  );
};
