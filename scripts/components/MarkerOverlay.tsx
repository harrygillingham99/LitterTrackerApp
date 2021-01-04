import React, { useEffect } from "react";
import { Overlay, Button, Card } from "react-native-elements";
import { LitterPin, LatLng } from "../services/api/Client";
import { GetLocationInformationForCoordinate } from "../services/Postcodes.io/Postcodes";
import { Loader } from "./Loader";
import { Location } from "../services/Postcodes.io/Types";
import useSetState from "react-use/lib/useSetState";

interface MapOverlayProps {
  selectedMarker: LitterPin | undefined;
}
interface MapOverlayState {
  location: Location;
  loading: boolean;
  lastFetchedMarker: LitterPin;
  visible: boolean;
}
export const MarkerOverlay = (props: MapOverlayProps) => {
  const { selectedMarker } = props;
  const [overlayState, setOverlayState] = useSetState<MapOverlayState>({
    location: null!,
    loading: false,
    lastFetchedMarker: null!,
    visible: false,
  });
  const { lastFetchedMarker, visible, loading, location } = overlayState;

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
      }
    })();
  }, [selectedMarker]);

  return (
    <Overlay
      isVisible={visible}
      onBackdropPress={() => setOverlayState({ visible: false })}
    >
      <>
        {loading && (
          <Card>
            <Loader />
          </Card>
        )}
        {!loading && (
          <Card>
            <Card.Title>{`${location?.parliamentary_constituency} - ${location?.postcode}`}</Card.Title>
            <Card.Divider />
            <Button title={"Add Photos"}></Button>
          </Card>
        )}
      </>
    </Overlay>
  );
};
