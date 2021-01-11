/* 
  Loader.tsx
  A small custom component to provide a uniform, central loader for anywhere that requires it. 
*/

import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { LoaderContainer } from "../styles/Styles";

export const Loader = () => (
  <View style={LoaderContainer}>
    <ActivityIndicator size="large" color="#00ff00" />
  </View>
);