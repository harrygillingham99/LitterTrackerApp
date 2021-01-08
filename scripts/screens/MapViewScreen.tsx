import React, { useState } from "react";
import { Alert, Dimensions, StyleProp, ViewStyle } from "react-native";
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
import { getPinColour, HeadingColour } from "../styles/Colours";

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
    tryGetSavedMapType,
  } = MapContainer.useContainer();

  const [permission, setPermission] = useState<boolean>(false);

  const { appState } = AppContainer.useContainer();

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
    tryGetSavedMapType();
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
            initialRegion={mapState.location}
            showsUserLocation={true}
            mapType={mapState.mapType}
            rotateEnabled={true}
            showsTraffic={true}
            onPress={(e) => {
              e.persist();
              Alert.alert(
                "Creating Litter Pin",
                "Are you sure you want to create a new pin ",
                [
                  {
                    text: "Yes",
                    onPress: () => OnMapPress(e),
                  },
                  {
                    text: "Cancel",
                    onPress: () => {
                      return;
                    },
                    style: "cancel",
                  },
                ],
                { cancelable: false }
              );
            }}
          >
            {mapState.markers?.map((marker, i) => (
              <Marker
                key={`pin-${i}`}
                pinColor={getPinColour(marker)}
                coordinate={{
                  latitude:
                    marker?.markerLocation?.latitude ??
                    mapState.location.latitude,
                  longitude:
                    marker?.markerLocation?.longitude ??
                    mapState.location.longitude,
                }}
                onPress={(e) => {
                  e.stopPropagation();
                  setMapState({ selectedMarker: marker });
                }}
              />
            ))}
            <Button
              containerStyle={{
                position: "absolute",
                top: "5%",
                left: "5%",
              }}
              buttonStyle={{ backgroundColor: HeadingColour }}
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
  flex: 1,
  alignSelf: "center",
};
