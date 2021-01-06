import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import { AppHeader } from "../components/nav/Header";
import { DrawerScreens } from "../types/nav/DrawerScreens";
import { Routes } from "../types/nav/Routes";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { AppLogoIcon } from "../components/AppLogoIcon";
import { Avatar, Button, ListItem } from "react-native-elements";
import { AppContainer } from "../state/AppState";
import { IConfig, LitterPin, LitterTrackerAppClient } from "../services/api/Client";
import { MapContainer } from "../state/MapState";
import useSetState from "react-use/lib/useSetState";
import { MarkerOverlay } from "../components/MarkerOverlay";
import { ScrollView } from "react-native-gesture-handler";

type HomeScreenNavigationProp = DrawerNavigationProp<
  DrawerScreens,
  Routes.Home
>;

type HomeScreenProps = {
  navigation: HomeScreenNavigationProp;
};

interface HomeScreenState{
    selectedMarker: LitterPin | undefined
}

export const HomeScreen = (props: HomeScreenProps) => {
  const { appState } = AppContainer.useContainer();
  const { markersForUser, setMapState } = MapContainer.useContainer();
  const [state, setState] = useSetState<HomeScreenState>({selectedMarker: undefined})

  useEffect(() => {
    (async () => {
      const token = await appState.user.getIdToken() ?? "not-logged-in"
      const client = new LitterTrackerAppClient(new IConfig(token));
      const markers = await client.getLitterPins();
      setMapState({markers: [...markers]})
    })();
  }, [appState.user]);
  
  return (
    <>
      <AppHeader
        leftComponentOnPress={props.navigation.toggleDrawer}
        centerComponent={AppLogoIcon}
      />
      {appState.user.isAnonymous && <></>}
      {!appState.user.isAnonymous && (
        <>
          <Text>Your pins:</Text>
          <ScrollView>
          {markersForUser().map((marker, i) => (
            <ListItem key={`markerListItem-${i}`} bottomDivider onPress={() => setState({selectedMarker: marker})}>
              <Avatar source={{ uri: undefined }} />
              <ListItem.Content>
                <ListItem.Title>{`Marker at: ${marker.markerLocation?.latitude?.toFixed(
                  2
                )}, ${marker.markerLocation?.longitude?.toFixed(
                  2
                )}`}</ListItem.Title>
                <ListItem.Subtitle>{`Created - ${marker.dateCreated}, Last updated - ${marker.dateLastUpdated}`}</ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>
          ))}
          </ScrollView>
          <MarkerOverlay selectedMarker={state.selectedMarker} />
        </>
      )}
      <Text>{appState.user.uid}</Text>
    </>
  );
};
