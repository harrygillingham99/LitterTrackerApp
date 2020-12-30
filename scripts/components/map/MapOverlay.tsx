import React from "react";
import { Overlay, Button, Card } from "react-native-elements";
import { LatLng } from "../../services/api/Client";
import { Location } from "../../services/Postcodes.io/Types"
import {
  GetLocationInformationForCoordinate
} from "../../services/Postcodes.io/Postcodes";
import { AppContainer } from "../../state/AppState";

export const MapOverlay = () => {
  const { mapState, setMapState } = AppContainer.useContainer();

  const toggleOverlay = () => {
    setMapState({ selectedMarker: undefined });
  };

  const [geolocation, setGeolocation] = React.useState<Location>();

  React.useEffect(() => {
    (async () => {
      if (mapState.selectedMarker !== undefined) {
        var location = await GetLocationInformationForCoordinate(
          new LatLng({
            latitude: mapState.selectedMarker.markerLocation?.latitude,
            longitude: mapState.selectedMarker.markerLocation?.longitude,
          })
        );
        setGeolocation(location);
      }
    })();
  }, [mapState.selectedMarker]);

  console.log(geolocation);

  return (
    <Overlay
      isVisible={mapState.selectedMarker !== undefined}
      onBackdropPress={toggleOverlay}
    >
      <Card>
        <Card.Title>{`${geolocation?.parliamentary_constituency} - ${geolocation?.postcode}`}</Card.Title>
        <Card.Divider />
        <Button title={"Add Photos"}></Button>
      </Card>
    </Overlay>
  );
};
