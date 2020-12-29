import React from "react";
import { Text } from "react-native";
import { AppHeader } from "../components/nav/Header";
import { DrawerScreens } from "../types/nav/DrawerScreens";
import { Routes } from "../types/nav/Routes";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { AppLogoIcon } from "../components/AppLogoIcon";
import { Button } from "react-native-elements";
import { AppContainer } from "../state/AppState";
import { IConfig, SessionClient } from "../services/api/Client";

type HomeScreenNavigationProp = DrawerNavigationProp<
  DrawerScreens,
  Routes.Home
>;

type HomeScreenProps = {
  navigation: HomeScreenNavigationProp;
};

export const HomeScreen = (props: HomeScreenProps) => {
  const { appState, getJwtTokenForUser } = AppContainer.useContainer();
  const client = new SessionClient(new IConfig(getJwtTokenForUser()))
  return (
    <>
      <AppHeader
        leftComponentOnPress={props.navigation.toggleDrawer}
        centerComponent={AppLogoIcon}
      />
      <Text>{appState.user.email}</Text>
      <Button title={"text"} onPress={() => client.getLitterPins().then(res => console.log(res)).catch(e => console.log(e))}/>
    </>
  );
};
