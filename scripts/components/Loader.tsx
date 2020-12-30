import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { LoaderContainer } from "../styles/Container";

export const Loader = () => (
  <View style={LoaderContainer}>
    <ActivityIndicator size="large" color="#00ff00" />
  </View>
);