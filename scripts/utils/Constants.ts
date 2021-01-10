import { LocationAccuracy } from "expo-location";
import { MAP_TYPES } from "react-native-maps";

export const DefaultLatDelta = 0.0018774168909985178;

export const DefaultLongDelta = 0.0015409290790560082;

export const PlaceholderPinImage = require("../../assets/tree.png");

export const LogInScreenImage = require("../../assets/stock.png");

export const InitialMapState = {
  location: {
    latitude: 50.72123099459833,
    longitude: -1.8765086308121681,
    latitudeDelta: 0.0717708440848881,
    longitudeDelta: 0.0630741566419597,
  },
  markers: [],
  mapLoading: false,
  mapType: MAP_TYPES.STANDARD,
  selectedMarker: undefined,
  showInfoOverlay: false,
  locationAccuracy: LocationAccuracy.Balanced
}