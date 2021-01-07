import React, { useRef } from "react";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { Text } from "react-native-elements";
import { DrawerScreens } from "../types/nav/DrawerScreens";
import { Routes } from "../types/nav/Routes";
import { AppContainer } from "../state/AppState";
import useEffectOnce from "react-use/lib/useEffectOnce";
import { Camera, CameraCapturedPicture } from "expo-camera";
import { MapContainer } from "../state/MapState";
import { View, ImageBackground, StyleSheet, Dimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import useSetState from "react-use/lib/useSetState";
import {
  LitterTrackerAppClient,
  UploadImageRequest,
} from "../services/api/Client";
import { IConfig } from "../services/api/ApiClient";
import { Loader } from "../components/Loader";

type CameraScreenNavigationProp = DrawerNavigationProp<
  DrawerScreens,
  Routes.Camera
>;

type CameraScreenProps = {
  navigation: CameraScreenNavigationProp;
};

interface CameraScreenState {
  permission: boolean;
  cameraType: any;
  image: CameraCapturedPicture | undefined;
  showPreview: boolean;
  loading: boolean;
}

export const CameraScreen = (props: CameraScreenProps) => {
  const { mapState, setMapState } = MapContainer.useContainer();
  const { appState } = AppContainer.useContainer();
  let cameraRef = useRef<Camera | null>(null);
  const [cameraState, setCameraState] = useSetState<CameraScreenState>({
    permission: false,
    cameraType: Camera.Constants.Type.back,
    image: undefined,
    showPreview: false,
    loading: false,
  });
  const { permission, cameraType, image, showPreview, loading } = cameraState;

  const CaptureImage = async () => {
    if (!permission) return;
    const photo = await cameraRef.current?.takePictureAsync({ base64: true });
    setCameraState({ showPreview: true, image: photo });
  };

  //This syntax is called an Immediately Invoked Function Expression (IIFE)
  //Provides a nice way to grab async data from a synchronous environment and not have to deal with promises
  const UploadFileAndAssignToPin = () => {
    (async () => {
      const token = (await appState.user.getIdToken()) ?? "not-logged-in";
      const client = new LitterTrackerAppClient(new IConfig(token));
      const fileName = await client.uploadImage(
        new UploadImageRequest({
          uploadedByUid: appState.user.uid,
          markerDatastoreId: mapState.selectedMarker?.dataStoreId ?? 1,
          base64Image: image!.base64!,
        })
      );
      const pinToUpdate = mapState!.selectedMarker!;
      pinToUpdate.imageUrls === undefined
        ? (pinToUpdate.imageUrls = new Array<string>(fileName))
        : pinToUpdate.imageUrls.push(fileName);
      var pinResult = await client.updateLitterPin(pinToUpdate);
      const newMarkerList = mapState.markers.map((marker) => {
        if (marker.dataStoreId === pinResult.dataStoreId) {
          marker = pinResult;
        }
        return marker;
      });
      setCameraState({ showPreview: false, image: undefined });
      setMapState({
        markers: newMarkerList,
        location: {
          latitude: pinResult!.markerLocation!.latitude!,
          longitude: pinResult!.markerLocation!.longitude!,
          latitudeDelta: mapState.location.latitudeDelta,
          longitudeDelta: mapState.location.longitudeDelta,
        },
        selectedMarker: undefined,
      });
      props.navigation.navigate("MapView");
    })();
  };

  const OnConfirmPhoto = () => {
    if (image === undefined) return;
    UploadFileAndAssignToPin();
  };

  useEffectOnce(() => {
    (async () => {
      let { status } = await Camera.requestPermissionsAsync();
      setCameraState({ permission: status === "granted" });
      if (status !== "granted") {
        console.log("Permission to access camera was denied");
        return;
      }
    })();
  });

  if (permission === null) {
    return <View />;
  }
  if (permission === false) {
    return <Text>No access to camera</Text>;
  }
  if (loading) {
    return <Loader />;
  }
  if (showPreview && image) {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={{
            uri: image.uri,
          }}
          style={{
            flex: 3,
          }}
        />
        <Text
          style={{
            alignContent: "center",
            backgroundColor: "#DDDDDD",
          }}
        >
          Would you like to keep this image?
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "stretch",
            marginBottom: 100,
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              alignItems: "center",
              padding: 10,
              backgroundColor: "#00ff00",
            }}
            onPress={() => OnConfirmPhoto()}
          >
            <Text>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              alignItems: "center",
              padding: 10,
              backgroundColor: "#FF0000",
            }}
            onPress={() =>
              setCameraState({ showPreview: false, image: undefined })
            }
          >
            <Text>No</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <Camera
          style={{ width: "100%", height: "100%" }}
          type={cameraType}
          ref={(ref) => {
            cameraRef.current = ref;
          }}
        >
          <View>
            <View>
              <TouchableOpacity onPress={() => CaptureImage()}>
                <Text
                  style={{
                    fontSize: 20,
                    width: 70,
                    height: 70,
                    bottom: 0,
                    borderRadius: 50,
                    backgroundColor: "#fff",
                  }}
                >
                  Take Photo
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Camera>
      </View>
    );
  }
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
  },
  button: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
  },
  countContainer: {
    alignItems: "center",
    padding: 10,
  },
});
