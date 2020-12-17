import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { AppHeader } from "../components/nav/Header";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { DrawerScreens } from "../types/nav/DrawerScreens";
import { Routes } from "../types/nav/Routes";
import { AppLogoIcon } from "../components/AppLogoIcon";

type MapViewScreenNavigationProp = DrawerNavigationProp<
  DrawerScreens,
  Routes.MapView
>;

type MapViewScreenProps = {
  navigation: MapViewScreenNavigationProp;
};

export const MapViewScreen = (props: MapViewScreenProps) => {
  return (
    <View style={styles.container}>
      <AppHeader
        leftComponentOnPress={props.navigation.toggleDrawer}
        centerComponent={AppLogoIcon}
      />
      <Text>Map HEre</Text>
      <StatusBar style="auto" />
    </View>
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
