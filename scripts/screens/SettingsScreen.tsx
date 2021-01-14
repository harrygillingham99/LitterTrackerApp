/* 
  SettingsScreen.tsx
  A simple settings screen with room for expansion. Currently allows the map type and 
  location accuracy to be toggled (less accurate = more battery life according to expo docs).
  These settings are stored in AsyncStorage so will persist when the app closes.
*/

import React from "react";
import { Text } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import * as Maps from "react-native-maps";
import { MapContainer } from "../state/MapState";
import useEffectOnce from "react-use/lib/useEffectOnce";
import { AppHeader } from "../components/nav/AppHeader";
import { DrawerScreens } from "../types/nav/DrawerScreens";
import { Routes } from "../types/nav/Routes";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { AppLogoIcon } from "../components/AppLogoIcon";
import { LocationAccuracy } from "expo-location";
import {
  saveMapTypeSelection,
  saveLocationAccuracy,
  saveCameraQuality,
} from "../storage/SettingsStorage";
import { Slider } from "react-native-elements";
import { AppContainer } from "../state/AppState";

type SettingsScreenNavigationProp = DrawerNavigationProp<
  DrawerScreens,
  Routes.Settings
>;

type SettingsScreenProps = {
  navigation: SettingsScreenNavigationProp;
};
export const SettingsScreen = (props: SettingsScreenProps) => {
  const {
    mapState,
    setMapState,
    tryGetSettingsItemsFromStorage,
  } = MapContainer.useContainer();

  const {
    cameraQuality,
    setCameraQuality,
    tryGetQualityFromStorage,
  } = AppContainer.useContainer();

  useEffectOnce(() => {
    tryGetSettingsItemsFromStorage();
    tryGetQualityFromStorage();
  });

  const mapTypeOptions = [
    { label: "Standard", value: Maps.MAP_TYPES.STANDARD },
    { label: "Hybrid", value: Maps.MAP_TYPES.HYBRID },
    { label: "Satellite", value: Maps.MAP_TYPES.SATELLITE },
    { label: "Terrain", value: Maps.MAP_TYPES.TERRAIN },
  ];

  const locationAccuracyOptions = [
    { label: "Balanced", value: LocationAccuracy.Balanced },
    { label: "Best For Navigation", value: LocationAccuracy.BestForNavigation },
    { label: "High", value: LocationAccuracy.High },
    { label: "Highest", value: LocationAccuracy.Highest },
    { label: "Low", value: LocationAccuracy.Low },
    { label: "Lowest", value: LocationAccuracy.Lowest },
  ];
  return (
    <>
      <AppHeader
        leftComponentOnPress={props.navigation.toggleDrawer}
        centerComponent={AppLogoIcon}
      />
      <Text>Map Type: {mapState.mapType}</Text>
      <DropDownPicker
        key={1}
        items={mapTypeOptions}
        defaultValue={mapState.mapType}
        onChangeItem={({ value }) => {
          saveMapTypeSelection(value as Maps.MapTypes);
          setMapState({
            mapType: value as Maps.MapTypes,
          });
        }}
        containerStyle={{ height: 40, width: 150 }}
        labelStyle={{ color: "black" }}
        style={{ backgroundColor: "#fafafa" }}
        itemStyle={{
          justifyContent: "flex-start",
        }}
        dropDownStyle={{ backgroundColor: "#fafafa" }}
        zIndex={5000}
      />
      <Text>
        Location Accuracy:{" "}
        {locationAccuracyOptions.find(
          (x) => x.value === mapState.locationAccuracy
        )?.label ?? "Unknown"}
      </Text>
      <DropDownPicker
        key={2}
        items={locationAccuracyOptions}
        defaultValue={mapState.locationAccuracy}
        onChangeItem={({ value }) => {
          saveLocationAccuracy(value as LocationAccuracy);
          setMapState({
            locationAccuracy: value as LocationAccuracy,
          });
        }}
        containerStyle={{ height: 40, width: 150 }}
        style={{ backgroundColor: "#fafafa" }}
        itemStyle={{
          justifyContent: "flex-start",
        }}
        labelStyle={{ color: "black" }}
        dropDownStyle={{ backgroundColor: "#fafafa" }}
        zIndex={4000}
      />
      <Text>Camera Quality: </Text>
      <Slider
        value={cameraQuality}
        onValueChange={(value) => {
          saveCameraQuality(value);
          setCameraQuality(value);
        }}
        minimumValue={0}
        maximumValue={1}
        step={0.05}
        style={{ width: 200 }}
      />
    </>
  );
};
