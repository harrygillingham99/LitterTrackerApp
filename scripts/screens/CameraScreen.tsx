import React, { useEffect, useRef } from "react";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { Button, Slider, Text } from "react-native-elements";
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
  LitterPin,
  LitterTrackerAppClient,
  UploadImageRequest,
} from "../services/api/Client";
import { IConfig } from "../services/api/ApiClient";
import { Loader } from "../components/Loader";
import { AppHeader } from "../components/nav/Header";
import { AppLogoIcon } from "../components/AppLogoIcon";
import { useIsFocused } from "@react-navigation/native";

type CameraScreenNavigationProp = DrawerNavigationProp<
  DrawerScreens,
  Routes.Camera
>;

type CameraScreenProps = {
  navigation: CameraScreenNavigationProp;
};

interface CameraScreenState {
  permission: boolean;
  cameraType: number;
  image: CameraCapturedPicture | undefined;
  showPreview: boolean;
  loading: boolean;
  zoom: number;
  selectedMarker?: LitterPin;
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
    zoom: 0,
    selectedMarker: undefined,
  });
  const {
    permission,
    cameraType,
    image,
    showPreview,
    loading,
    zoom,
    selectedMarker,
  } = cameraState;

  const resetCameraState = () => {
    setCameraState({
      cameraType: Camera.Constants.Type.back,
      image: undefined,
      showPreview: false,
      loading: false,
      zoom: 0,
      selectedMarker: undefined,
    });
  };

  const cameraFocused = useIsFocused();

  useEffect(() => {
    if(cameraFocused)
    {
    setCameraState({ selectedMarker: mapState.selectedMarker });
    setMapState({ selectedMarker: undefined });}
    else{
      resetCameraState();
      setMapState({selectedMarker: undefined})
    }
  }, [cameraFocused]);

  const captureImage = async () => {
    if (!permission) return;
    const photo = await cameraRef.current?.takePictureAsync({ base64: true });
    setCameraState({ showPreview: true, image: photo });
  };

  const uploadFileAndAssignToPin = async () => {
    setCameraState({ loading: true });
    const token = (await appState.user.getIdToken()) ?? "not-logged-in";
    const client = new LitterTrackerAppClient(new IConfig(token));
    const fileName = await client.uploadImage(
      new UploadImageRequest({
        uploadedByUid: appState.user.uid,
        markerDatastoreId: selectedMarker?.dataStoreId ?? 1,
        base64Image: image!.base64!,
      })
    );
    const pinToUpdate = selectedMarker!;
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
    props.navigation.jumpTo(Routes.Home);
  };

  const onConfirmPhoto = () => {
    if (image === undefined) return;
    uploadFileAndAssignToPin();
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
    return (
      <>
        <AppHeader
          leftComponentOnPress={props.navigation.toggleDrawer}
          centerComponent={AppLogoIcon}
        />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Loader />
        </View>
      </>
    );
  }
  if (showPreview && image && cameraFocused) {
    return (
      <ImageBackground
        source={{ uri: image.uri }}
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            padding: 15,
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              onPress={() =>
                setCameraState({ showPreview: false, image: undefined })
              }
              style={{
                width: 130,
                height: 40,

                alignItems: "center",
                borderRadius: 4,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 20,
                }}
              >
                Re-Take
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirmPhoto}
              style={{
                width: 130,
                height: 40,

                alignItems: "center",
                borderRadius: 4,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 20,
                }}
              >
                Save Photo
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    );
  } else {
    return (
      <Camera
        style={{ flex: 1 }}
        type={cameraType}
        ref={(r) => {
          cameraRef.current = r;
        }}
        zoom={zoom}
      >
        <Button
          containerStyle={{
            position: "absolute",
            top: "5%",
            right: "5%",
          }}
          buttonStyle={{ backgroundColor: "transparent" }}
          title="Close"
          onPress={() => {
            resetCameraState();
            props.navigation.jumpTo(Routes.Home);
          }}
        ></Button>
        <Button
          containerStyle={{
            position: "absolute",
            top: "5%",
            left: "5%",
          }}
          buttonStyle={{ backgroundColor: "transparent" }}
          title="Flip"
          onPress={() =>
            setCameraState({ cameraType: cameraType === 1 ? 2 : 1 })
          }
        ></Button>
        <View
          style={{
            position: "absolute",
            bottom: 0,
            flexDirection: "row",
            flex: 1,
            width: "100%",
            padding: 20,
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              alignSelf: "center",
              flex: 1,
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => captureImage()}
              style={{
                width: 70,
                height: 70,
                bottom: 0,
                borderRadius: 50,
                backgroundColor: "#fff",
              }}
            />
          </View>
        </View>
        <View
          style={{
            position: "absolute",
            bottom: 0,
            flexDirection: "row",
            flex: 1,
            padding: 20,
            justifyContent: "space-between",
          }}
        >
          <View>
            <Text style={{ color: "white" }}>Zoom</Text>
            <Slider
              value={zoom}
              onValueChange={(value) => setCameraState({ zoom: value })}
              minimumValue={0}
              maximumValue={1}
              step={0.05}
              style={{ width: 100 }}
            />
          </View>
        </View>
      </Camera>
    );
  }
};
