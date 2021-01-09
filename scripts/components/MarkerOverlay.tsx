import React, { useEffect } from "react";
import { Overlay, Button, Card, Image, Text } from "react-native-elements";
import {
  LitterPin,
  LatLng,
  IConfig,
  LitterTrackerAppClient,
} from "../services/api/Client";
import { GetLocationInformationForCoordinate } from "../services/Postcodes.io/Postcodes";
import { Loader } from "./Loader";
import { Location } from "../services/Postcodes.io/Types";
import useSetState from "react-use/lib/useSetState";
import { navigate } from "../types/nav/NavigationRef";
import { Routes } from "../types/nav/Routes";
import { GetGoogleImageUrlFromItem } from "../utils/GoogleStorage";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { Dimensions, StyleSheet, View } from "react-native";
import { MapContainer } from "../state/MapState";
import { AppContainer } from "../state/AppState";
import { capitalizeFirstLetter } from "../utils/Strings";
import { AppColour } from "../styles/Colours";
import { PlaceholderPinImage } from "../utils/Constants";

interface MapOverlayState {
  location: Location;
  loading: boolean;
  lastFetchedMarker: LitterPin;
  visible: boolean;
  carouselIndex?: number;
}
export const MarkerOverlay = () => {
  const { setMapState, mapState } = MapContainer.useContainer();
  const { appState } = AppContainer.useContainer();
  const [overlayState, setOverlayState] = useSetState<MapOverlayState>({
    location: null!,
    loading: false,
    lastFetchedMarker: null!,
    visible: false,
    carouselIndex: undefined,
  });
  const { lastFetchedMarker, visible, loading, location } = overlayState;

  console.log(JSON.stringify(mapState.selectedMarker))
  //Using an IIFE (Immediately Invoked Function Expression) in any effect which has async actions
  useEffect(() => {
    (async () => {
      if (
        mapState.selectedMarker !== undefined &&
        mapState.selectedMarker !== lastFetchedMarker
      ) {
        setOverlayState({ visible: true, loading: true });
        var location = await GetLocationInformationForCoordinate(
          new LatLng({
            latitude: mapState.selectedMarker.markerLocation?.latitude,
            longitude: mapState.selectedMarker.markerLocation?.longitude,
          })
        );
        setOverlayState({
          location: location,
          lastFetchedMarker: mapState.selectedMarker,
          loading: false,
        });
      } else if (
        mapState.selectedMarker !== undefined &&
        mapState.selectedMarker === lastFetchedMarker
      ) {
        setOverlayState({ visible: true });
      }
    })();
  }, [mapState.selectedMarker]);

  const renderCarouselItem = (item: { item: string; index: number }) => {
    return (
      <Image
        key={item.index}
        style={{ width: 200, height: 200 }}
        source={{ uri: GetGoogleImageUrlFromItem(item.item) }}
      ></Image>
    );
  };

  const dismissOverlay = () => {
    setOverlayState({ visible: false, carouselIndex: undefined });
    setMapState({ selectedMarker: undefined });
  };

  const onAreaCleanedPress = async () => {
    const token = (await appState.user.getIdToken()) ?? "not-logged-in";
    const client = new LitterTrackerAppClient(new IConfig(token));
    const pinToUpdate = mapState.selectedMarker!;
    pinToUpdate.areaCleaned = true;
    var pinResult = await client.updateLitterPin(pinToUpdate);
    const newMarkerList = mapState.markers.map((marker) => {
      if (marker.dataStoreId === pinResult.dataStoreId) {
        marker = pinResult;
      }
      return marker;
    });
    setMapState({ markers: newMarkerList });
    dismissOverlay();
  };

  const markerHasImages =
    mapState.selectedMarker !== undefined &&
    mapState.selectedMarker.imageUrls !== undefined &&
    mapState.selectedMarker.imageUrls[0] !== undefined;

  return (
    <Overlay isVisible={visible} onBackdropPress={dismissOverlay}>
      <>
        <Button
          containerStyle={{
            position: "absolute",
            top: "1%",
            right: "1%",
          }}
          buttonStyle={{ backgroundColor: AppColour }}
          title="X"
          onPress={dismissOverlay}
        ></Button>
        {loading && (
          <Card
            containerStyle={{
              height: Dimensions.get("window").height * 0.8,
              width: Dimensions.get("window").width * 0.8,
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View>
              <Loader />
            </View>
          </Card>
        )}
        {!loading && (
          <Card
            containerStyle={{
              height: Dimensions.get("window").height * 0.8,
              width: Dimensions.get("window").width * 0.8,
              marginBottom: 10,
              borderColor: "transparent",
              shadowColor: "transparent",
              backgroundColor: "transparent",
            }}
          >
            <Card.Title>{`${location?.parliamentary_constituency} - ${location?.postcode}`}</Card.Title>
            <Card.Divider />
            {mapState.selectedMarker !== undefined &&
              mapState.selectedMarker.imageUrls !== undefined &&
              markerHasImages && (
                <View
                  style={{
                    alignItems: "center",
                    alignContent: "center",
                    marginBottom:
                      mapState.selectedMarker.imageUrls.length > 1 ? 5 : 15,
                  }}
                >
                  <Carousel
                    data={mapState.selectedMarker.imageUrls}
                    style={{ flex: 1 }}
                    renderItem={renderCarouselItem}
                    itemWidth={200}
                    sliderWidth={200}
                    sliderHeight={50}
                    itemHeight={200}
                    onSnapToItem={(index) =>
                      setOverlayState({ carouselIndex: index })
                    }
                  ></Carousel>
                  <Pagination
                    dotsLength={mapState.selectedMarker?.imageUrls?.length}
                    activeDotIndex={overlayState.carouselIndex ?? 0}
                    containerStyle={{
                      backgroundColor: "white",
                      paddingTop: 10,
                      paddingBottom: 5,
                    }}
                    dotStyle={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      marginHorizontal: 2,
                      backgroundColor: "black",
                    }}
                    inactiveDotOpacity={0.4}
                    inactiveDotScale={0.6}
                  />
                </View>
              )}
            {mapState.selectedMarker !== undefined &&
              mapState.selectedMarker.imageUrls !== undefined &&
              !markerHasImages && (
                <View
                  style={{
                    alignItems: "center",
                    alignContent: "center",
                    marginBottom: 15,
                  }}
                >
                  <Image
                    style={{ width: 200, height: 200 }}
                    source={PlaceholderPinImage}
                  ></Image>
                </View>
              )}
            <Card.Divider />
            {mapState.selectedMarker !== undefined &&
              mapState.selectedMarker.weatherData !== undefined && (
                <View style={{ marginBottom: 10 }}>
                  <Text style={{ fontSize: 18, marginBottom: 5 }}>
                    Recorded Temperature:{" "}
                    {mapState.selectedMarker.weatherData.temperature?.toFixed(
                      1
                    )}
                    °C
                  </Text>
                  <Text style={{ fontSize: 18, marginBottom: 5 }}>
                    Weather Description:{" "}
                    {capitalizeFirstLetter(
                      mapState.selectedMarker.weatherData.weatherDescription ??
                        "no description saved"
                    )}
                  </Text>
                  <Text style={{ fontSize: 18, marginBottom: 5 }}>
                    Recorded Wind Direction:{" "}
                    {mapState.selectedMarker.weatherData.windDirection}°
                  </Text>
                  <Text style={{ fontSize: 18, marginBottom: 5 }}>
                    Recorded Wind Speed:{" "}
                    {mapState.selectedMarker.weatherData.windSpeed} m/s
                  </Text>
                  <Text style={{ fontSize: 18, marginBottom: 5 }}>
                    Area Cleaned:
                    {mapState.selectedMarker.areaCleaned ? " true" : " false"}
                  </Text>
                </View>
              )}
            <Card.Divider />
            <Button
              title={"Add Photos"}
              style={{ marginBottom: 10, backgroundColor: AppColour }}
              buttonStyle={{ backgroundColor: AppColour }}
              onPress={() => {
                setOverlayState({ visible: false  });
                navigate(Routes.Camera);
              }}
            ></Button>
            <Button
              title={"Area Cleaned"}
              style={{ backgroundColor: AppColour }}
              buttonStyle={{ backgroundColor: AppColour }}
              onPress={() => onAreaCleanedPress()}
              disabled={mapState.selectedMarker?.areaCleaned}
            ></Button>
          </Card>
        )}
      </>
    </Overlay>
  );
};
