import React from "react";
import { StyleSheet, Text, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { MapTypes } from "../utils/Constants";
import { ListItem } from "react-native-elements";
import * as Maps from "react-native-maps";
import { MapContainer } from "../state/MapState";
import useEffectOnce from "react-use/lib/useEffectOnce";
import { AppHeader } from "../components/nav/Header";
import { DrawerScreens } from "../types/nav/DrawerScreens";
import { Routes } from "../types/nav/Routes";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { AppLogoIcon } from "../components/AppLogoIcon";

type SettingsScreenNavigationProp = DrawerNavigationProp<
  DrawerScreens,
  Routes.Settings
>;

type SettingsScreenProps = {
  navigation: SettingsScreenNavigationProp
}
export const SettingsScreen = (props: SettingsScreenProps) => {
  const {
    mapState,
    setMapState,
    saveMapTypeSelection,
    tryGetSavedMapType,
  } = MapContainer.useContainer();
  const GetMapType = (text: React.ReactText) => {
    switch (text) {
      case MapTypes.hybrid:
        return Maps.MAP_TYPES.HYBRID;
      case MapTypes.satellite:
        return Maps.MAP_TYPES.SATELLITE;
      case MapTypes.standard:
        return Maps.MAP_TYPES.STANDARD;
      case MapTypes.terrain:
        return Maps.MAP_TYPES.TERRAIN;
      default:
        return Maps.MAP_TYPES.STANDARD;
    }
  };
  useEffectOnce(() => {
    tryGetSavedMapType();
  });
  return (
    <><AppHeader
      leftComponentOnPress={props.navigation.toggleDrawer}
      centerComponent={AppLogoIcon} />
      <View style={styles.container}>
        <Text>{mapState.mapType}</Text>
        <ListItem>
          <DropDownPicker
            items={[
              { label: MapTypes.standard, value: MapTypes.standard },
              { label: MapTypes.hybrid, value: MapTypes.hybrid },
              { label: MapTypes.satellite, value: MapTypes.satellite },
              { label: MapTypes.terrain, value: MapTypes.terrain },
            ]}
            defaultValue={mapState.mapType}
            onChangeItem={({ value }) => {
              const mapType = GetMapType(value);
              saveMapTypeSelection(mapType);
              setMapState({
                mapType: mapType,
              });
            } }
            containerStyle={{ height: 40, width: 150 }}
            style={{ backgroundColor: "#fafafa" }}
            itemStyle={{
              justifyContent: "flex-start",
            }}
            dropDownStyle={{ backgroundColor: "#fafafa" }} />
        </ListItem>
      </View></>
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
