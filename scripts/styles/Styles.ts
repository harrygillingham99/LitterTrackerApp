import { Dimensions, StyleProp, ViewStyle } from "react-native";

export const Container: StyleProp<ViewStyle> = {
  justifyContent: "flex-start", //Centered vertically
  alignItems: "center", // Centered horizontally
  flex: 1,
};

export const LoaderContainer: StyleProp<ViewStyle> = {
  flex: 1,
  flexDirection: "row",
  justifyContent: "space-around",
  padding: 10,
};

export const MapStyles: StyleProp<ViewStyle> = {
  width: Dimensions.get("window").width,
  height: Dimensions.get("window").height,
  flex: 1,
  alignSelf: "center",
  zIndex: 4500,
};
