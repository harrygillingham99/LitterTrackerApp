import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Routes } from "./scripts/types/nav/Routes";
import { HomeScreen } from "./scripts/screens/HomeScreen";
import { Drawer } from "./scripts/components/nav/Drawer";
import { MapViewScreen } from "./scripts/screens/MapViewScreen";
import { SettingsScreen } from "./scripts/screens/SettingsScreen";

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName={Routes.Home}>
        <Drawer.Screen
          name={Routes.Home}
          component={HomeScreen}
          options={{ title: Routes.Home }}
        />
        <Drawer.Screen
          name={Routes.MapView}
          component={MapViewScreen}
          options={{ title: Routes.MapView }}
        />
        <Drawer.Screen
          name={Routes.Settings}
          component={SettingsScreen}
          options={{ title: Routes.Settings }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
