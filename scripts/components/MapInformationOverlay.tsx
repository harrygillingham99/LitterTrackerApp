import React from "react";
import { Dimensions, View } from "react-native";
import { Card, Icon, Overlay, Text } from "react-native-elements";
import { MapContainer } from "../state/MapState";

export const MapInfoOverlay = () => {
  const { mapState, setMapState } = MapContainer.useContainer();

  const dismissOverlay = () => {
    setMapState({ showInfoOverlay: false });
  };
  return (
    <Overlay
      isVisible={mapState.showInfoOverlay}
      onBackdropPress={dismissOverlay}
    >
      <Card
        containerStyle={{
          maxWidth: Dimensions.get("window").width * 0.8,
          marginBottom: 15,
        }}
      >
        <Card.Title>Using the map</Card.Title>
        <Card.Divider />
        <View style={{ marginBottom: 15 }}>
          <Text>
            <Icon type="feather" name="map-pin" /> Litter pins without photos.
          </Text>
          <Text>
            <Icon type="feather" name="map-pin" color="blue" /> Litter pins that
            need tidying.
          </Text>
          <Text>
            <Icon type="feather" name="map-pin" color="green" /> Completed
            litter pins.
          </Text>
        </View>
        <Card.Divider />
        <Text style={{ marginBottom: 15 }}>
          To use the map, tap on the location you want to place a pin and
          confirm. Then tap on the newly added pin to add some photos of the
          litter.
        </Text>
        <Card.Divider />
        <Text>
          Pins will support multiple photos too, so upload as many as you need
          to show everything that needs collecting.
        </Text>
      </Card>
    </Overlay>
  );
};
