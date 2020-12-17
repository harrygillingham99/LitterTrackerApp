import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { AppHeader } from "../components/nav/Header";
import { DrawerScreens } from "../types/nav/DrawerScreens";
import { Routes } from "../types/nav/Routes";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { AppLogoIcon } from "../components/AppLogoIcon";

type HomeScreenNavigationProp = DrawerNavigationProp<
  DrawerScreens,
  Routes.Home
>;

type HomeScreenProps = {
  navigation: HomeScreenNavigationProp;
};

export const HomeScreen = (props : HomeScreenProps) => {
  return (<>
    <AppHeader leftComponentOnPress={props.navigation.toggleDrawer} centerComponent={AppLogoIcon}/>
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
