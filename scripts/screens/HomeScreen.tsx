import React from "react";
import { Text } from "react-native";
import { AppHeader } from "../components/nav/Header";
import { DrawerScreens } from "../types/nav/DrawerScreens";
import { Routes } from "../types/nav/Routes";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { AppLogoIcon } from "../components/AppLogoIcon";
import { Button } from "react-native-elements";
import { GetJwtToken } from "../services/firebase/Firebase";
import { FirebaseAuthConsumer } from "@react-firebase/auth";
import * as firebase from "firebase";
import { IConfig, SessionClient } from "../services/api/Client";

type HomeScreenNavigationProp = DrawerNavigationProp<
  DrawerScreens,
  Routes.Home
>;

type HomeScreenProps = {
  navigation: HomeScreenNavigationProp;
};

export const HomeScreen = (props: HomeScreenProps) => {
  GetJwtToken()?.then((x) => SetToken(x));
  const [token, SetToken] = React.useState<string>();
  const apiClient = new SessionClient(new IConfig(token ?? "reee"));
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
              <Text>Home</Text>
              <Button
                title={"test"}
                onPress={() => apiClient.getLitterPins().then(res => console.log(res))}
              />
            </>
          );
        }}
      </FirebaseAuthConsumer>
    </>
  );
};
