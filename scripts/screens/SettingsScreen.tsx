import React from "react";
import { Text } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import * as Maps from "react-native-maps";
import { MapContainer } from "../state/MapState";
import useEffectOnce from "react-use/lib/useEffectOnce";
import { AppHeader } from "../components/nav/Header";
import { DrawerScreens } from "../types/nav/DrawerScreens";
import { Routes } from "../types/nav/Routes";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { AppLogoIcon } from "../components/AppLogoIcon";
import { LocationAccuracy } from "expo-location";

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
    saveMapTypeSelection,
    tryGetSavedMapType,
    tryGetSavedLocationAccuracy,
    saveLocationAccuracy,
  } = MapContainer.useContainer();

  useEffectOnce(() => {
    tryGetSavedMapType();
    tryGetSavedLocationAccuracy();
  });

  const mapTypeLabels = [
    { label: "Standard", value: Maps.MAP_TYPES.STANDARD },
    { label: "Hybrid", value: Maps.MAP_TYPES.HYBRID },
    { label: "Satellite", value: Maps.MAP_TYPES.SATELLITE },
    { label: "Terrain", value: Maps.MAP_TYPES.TERRAIN },
  ];

  const locationAccuracyLabels = [
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
            items={mapTypeLabels}
            defaultValue={mapState.mapType}
            onChangeItem={({ value }) => {
              saveMapTypeSelection(value as Maps.MapTypes);
              setMapState({
                mapType: value as Maps.MapTypes,
              });
            }}
            containerStyle={{ height: 40, width: 150 }}
            style={{ backgroundColor: "#fafafa" }}
            itemStyle={{
              justifyContent: "flex-start",
            }}
            dropDownStyle={{ backgroundColor: "#fafafa" }}
          />
      <Text>Location Accuracy: {locationAccuracyLabels.find(x => x.value === mapState.locationAccuracy)?.label ?? "Unknown"}</Text>
      <DropDownPicker
        key={2}
        items={locationAccuracyLabels}
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
        dropDownStyle={{ backgroundColor: "#fafafa" }}
      />
    </>
  );
};


