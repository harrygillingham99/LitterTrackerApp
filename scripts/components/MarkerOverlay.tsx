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
import { Dimensions, View } from "react-native";
import { MapContainer } from "../state/MapState";
import { AppContainer } from "../state/AppState";

interface MapOverlayProps {
  selectedMarker: LitterPin | undefined;
}
interface MapOverlayState {
  location: Location;
  loading: boolean;
  lastFetchedMarker: LitterPin;
  visible: boolean;
  carouselIndex?: number;
}
export const MarkerOverlay = (props: MapOverlayProps) => {
  const { selectedMarker } = props;
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

  //Using an IIFE (Immediately Invoked Function Expression) in any effect which has async actions 
  useEffect(() => {
    (async () => {
      if (
        selectedMarker !== undefined &&
        selectedMarker !== lastFetchedMarker
      ) {
        setOverlayState({ visible: true, loading: true });
        var location = await GetLocationInformationForCoordinate(
          new LatLng({
            latitude: selectedMarker.markerLocation?.latitude,
            longitude: selectedMarker.markerLocation?.longitude,
          })
        );
        setOverlayState({
          location: location,
          lastFetchedMarker: selectedMarker,
          loading: false,
        });
      } else if (
        selectedMarker !== undefined &&
        selectedMarker === lastFetchedMarker
      ) {
        setOverlayState({ visible: true });
      }
    })();
  }, [selectedMarker]);

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
    const pinToUpdate = selectedMarker!;
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

  return (
    <Overlay isVisible={visible} onBackdropPress={dismissOverlay}>
      <>
        {loading && (
          <Card
            containerStyle={{
              height: Dimensions.get("window").height * 0.8,
              width: Dimensions.get("window").width * 0.8,
              
            }}
          >
            <Loader />
          </Card>
        )}
        {!loading && (
          <Card
            containerStyle={{
              height: Dimensions.get("window").height * 0.8,
              width: Dimensions.get("window").width * 0.8,
              marginBottom: 10
            }}
          >
            <Card.Title>{`${location?.parliamentary_constituency} - ${location?.postcode}`}</Card.Title>
            <Card.Divider />
            {selectedMarker !== undefined &&
              selectedMarker.imageUrls !== undefined && (
                <View
                  style={{
                    alignItems: "center",
                    alignContent: "center",
                    marginBottom: 5,
                  }}
                >
                  <Carousel
                    data={selectedMarker.imageUrls}
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
                    dotsLength={selectedMarker?.imageUrls?.length}
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
            {selectedMarker !== undefined &&
              selectedMarker.weatherData !== undefined && (
                <>
                  <Text>{JSON.stringify(selectedMarker.weatherData)}</Text>
                  <Text>Area Cleaned: {selectedMarker.areaCleaned ? "true" : "false"}</Text>
                </>
              )}
            <Button
              title={"Add Photos"}
              onPress={() => {
                setOverlayState({ visible: false });
                navigate(Routes.Camera);
              }}
            ></Button>
            <Button
              title={"Area Cleaned"}
              onPress={() => onAreaCleanedPress()}
              disabled={selectedMarker?.areaCleaned}
            ></Button>
          </Card>
        )}
      </>
    </Overlay>
  );
};
