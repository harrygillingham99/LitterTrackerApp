import React from "react";
import { StyleSheet, Text, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { MapTypes } from "../utils/Constants";
import { AppContainer } from "../state/AppState";
import { ListItem } from "react-native-elements";
import * as Maps from "react-native-maps";

export const SettingsScreen = () => {
  const { mapState, setMapState } = AppContainer.useContainer();
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
  return (
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
          onChangeItem={({value}) =>
            setMapState({
              mapType: GetMapType(value),
            })
          }
          containerStyle={{ height: 40, width: 150 }}
          style={{ backgroundColor: "#fafafa" }}
          itemStyle={{
            justifyContent: "flex-start",
          }}
          dropDownStyle={{ backgroundColor: "#fafafa" }}
        />
      </ListItem>
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
