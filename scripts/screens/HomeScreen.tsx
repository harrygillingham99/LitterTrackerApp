import React from "react";
import { Text } from "react-native";
import { AppHeader } from "../components/nav/Header";
import { DrawerScreens } from "../types/nav/DrawerScreens";
import { Routes } from "../types/nav/Routes";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { AppLogoIcon } from "../components/AppLogoIcon";
import { Button } from "react-native-elements";
import { FirebaseAuthConsumer } from "@react-firebase/auth";
import { AppContainer } from "../state/AppState";

type HomeScreenNavigationProp = DrawerNavigationProp<
  DrawerScreens,
  Routes.Home
>;

type HomeScreenProps = {
  navigation: HomeScreenNavigationProp;
};

export const HomeScreen = (props: HomeScreenProps) => {
  const {appState} = AppContainer.useContainer()
  return (
    <>
      <FirebaseAuthConsumer>
        {({ user }) => {
          console.log(user);
          return (
            <>
              <AppHeader
                leftComponentOnPress={props.navigation.toggleDrawer}
                centerComponent={AppLogoIcon}
              />
              <Text>{JSON.stringify(appState.user)}</Text>
              <Button
                title={"text"}
              />
            </>
          );
        }}
      </FirebaseAuthConsumer>
    </>
  );
};
