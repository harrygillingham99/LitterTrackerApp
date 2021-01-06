import React, { useRef, useState } from "react";
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
import { Marker } from "react-native-maps";

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
}

export const CameraScreen = (props: CameraScreenProps) => {
  const {
    mapState,
    setMapState,
    newPinsRequiringPhotos,
  } = MapContainer.useContainer();

  const { appState } = AppContainer.useContainer();

  let cameraRef = useRef<Camera | null>(null);

  const [cameraState, setCameraState] = useSetState<CameraScreenState>({
    permission: false,
    cameraType: Camera.Constants.Type.back,
    image: undefined,
    showPreview: false,
  });

  const { permission, cameraType, image, showPreview } = cameraState;

  const CaptureImage = async () => {
    if (!permission) return;
    const photo = await cameraRef.current?.takePictureAsync({ base64: true });
    setCameraState({ showPreview: true, image: photo });
  };

  const UploadFile = () => {
    (async () => {
      const token = (await appState.user.getIdToken()) ?? "not-logged-in";
      const client = new LitterTrackerAppClient(new IConfig(token));
      await client.uploadImage(
        new UploadImageRequest({
          uploadedByUid: appState.user.uid,
          markerDatastoreId: mapState.selectedMarker?.dataStoreId ?? 1,
          base64Image: image!.base64!,
        })
      );
      setCameraState({ showPreview: false });
    })();
  };

  const OnConfirmPhoto = () => {
    if (cameraState.image === undefined) return;
    UploadFile();
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
