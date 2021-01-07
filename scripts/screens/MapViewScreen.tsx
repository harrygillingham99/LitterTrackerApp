import React, { useState } from "react";
import { Dimensions, StyleProp, ViewStyle } from "react-native";
import { AppHeader } from "../components/nav/Header";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { DrawerScreens } from "../types/nav/DrawerScreens";
import { Routes } from "../types/nav/Routes";
import { AppLogoIcon } from "../components/AppLogoIcon";
import MapView, { MapEvent, Marker } from "react-native-maps";
import { AppContainer } from "../state/AppState";
import useEffectOnce from "react-use/lib/useEffectOnce";
import * as Location from "expo-location";
import { Button, Text } from "react-native-elements";
import { Loader } from "../components/Loader";
import {
  IConfig,
  LatLng,
  LitterPin,
  LitterTrackerAppClient,
} from "../services/api/Client";
import { MapContainer } from "../state/MapState";
import { MarkerOverlay } from "../components/MarkerOverlay";

type MapViewScreenNavigationProp = DrawerNavigationProp<
  DrawerScreens,
  Routes.MapView
>;

type MapViewScreenProps = {
  navigation: MapViewScreenNavigationProp;
};

export const MapViewScreen = (props: MapViewScreenProps) => {
  const {
    mapState,
    setMapState,
    newPinsRequiringPhotos,
  } = MapContainer.useContainer();

  const [permission, setPermission] = useState<boolean>(false);

  const { appState, refreshPins } = AppContainer.useContainer();

  const OnCenterMapPress = () => {
    (async () => {
      setMapState({ mapLoading: true });
      let location = await Location.getCurrentPositionAsync({});
      setMapState({
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: mapState.location.latitudeDelta,
          longitudeDelta: mapState.location.longitudeDelta,
        },
        mapLoading: false,
      });
    })();
  };

  useEffectOnce(() => {
    (async () => {
      const { status } = await Location.requestPermissionsAsync();
      setPermission(status === "granted");
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }
    })();
  });

  const OnMapPress = async (event: MapEvent) => {
    event.persist();
    const token = await appState.user.getIdToken();
    const client = new LitterTrackerAppClient(new IConfig(token));
    const newPin = await client.createNewLitterPin(
      new LitterPin({
        markerLocation: new LatLng({
          latitude: event.nativeEvent.coordinate.latitude,
          longitude: event.nativeEvent.coordinate.longitude,
        }),
        imageUrls: undefined,
      })
    );
    setMapState({
      markers: [...mapState.markers, newPin],
      location: {
        latitude: event.nativeEvent.coordinate.latitude,
        longitude: event.nativeEvent.coordinate.longitude,
        latitudeDelta: mapState.location.latitudeDelta,
        longitudeDelta: mapState.location.longitudeDelta,
      },
    });
  };

  return (
    <>
      <AppHeader
        leftComponentOnPress={props.navigation.toggleDrawer}
        centerComponent={AppLogoIcon}
      />
      {!mapState.mapLoading && permission && (
        <>
          <MapView
            provider={"google"}
            style={BeachMapStyles}
            region={{
              latitude: mapState.location.latitude,
              longitude: mapState.location.longitude,
              latitudeDelta: mapState.location.latitudeDelta,
              longitudeDelta: mapState.location.longitudeDelta,
            }}
            showsUserLocation={true}
            onRegionChangeComplete={({
              latitude,
              latitudeDelta,
              longitude,
              longitudeDelta,
            }) => {
              setMapState({
                location: {
                  latitude: latitude,
                  longitude: longitude,
                  latitudeDelta: latitudeDelta,
                  longitudeDelta: longitudeDelta,
                },
              });
            }}
            mapType={mapState.mapType}
            rotateEnabled={true}
            showsTraffic={true}
            onPress={(e) => OnMapPress(e)}
          >
            {mapState.markers?.map((marker, i) => (
              <Marker
                key={`pin-${i}`}
                pinColor={
                  newPinsRequiringPhotos.indexOf(marker) > 0 ? "black" : "green"
                }
                coordinate={{
                  latitude:
                    marker?.markerLocation?.latitude ??
                    mapState.location.latitude,
                  longitude:
                    marker?.markerLocation?.longitude ??
                    mapState.location.longitude,
                }}
                onPress={() => setMapState({ selectedMarker: marker })}
              />
            ))}
            <Button
              style={buttonCallout}
              title="Center"
              onPress={() => OnCenterMapPress()}
            ></Button>
          </MapView>
          <MarkerOverlay selectedMarker={mapState.selectedMarker} />
        </>
      )}
      {mapState.mapLoading && <Loader />}
      {!mapState.mapLoading && !permission && (
        <Text>Permission needed to access Location Services.</Text>
      )}
    </>
  );
};

export const BeachMapStyles: StyleProp<ViewStyle> = {
  width: Dimensions.get("window").width,
  height: Dimensions.get("window").height,
  marginBottom: 50,
  flex: 1,
  justifyContent: "center",
};
export const buttonCallout: StyleProp<ViewStyle> = {
  flex: 1,
  flexDirection: "row",
  position: "absolute",
  bottom: 10,
  alignSelf: "flex-end",
  justifyContent: "flex-end",
  backgroundColor: "green",
  borderWidth: 0.5,
  borderRadius: 20,
};
