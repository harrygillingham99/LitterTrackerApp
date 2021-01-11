/* 
  App.tsx
  The main entry point for the application. This contains all of the unstated-next container 
  providers as well as the provider for firebase and the apps navigation.
*/

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Routes } from "./scripts/types/nav/Routes";
import { HomeScreen } from "./scripts/screens/HomeScreen";
import { Drawer } from "./scripts/components/nav/Drawer";
import { MapViewScreen } from "./scripts/screens/MapViewScreen";
import { SettingsScreen } from "./scripts/screens/SettingsScreen";
import { FirebaseAuthProvider, IfFirebaseAuthed } from "@react-firebase/auth";
import firebase from "firebase";
import { firebaseConfig } from "./scripts/services/firebase/Firebase";
import { NotLoggedInScreen } from "./scripts/screens/NotLoggedInScreen";
import { AppContainer } from "./scripts/state/AppState";
import { MapContainer } from "./scripts/state/MapState";
import { CameraScreen } from "./scripts/screens/CameraScreen";
import { navigationRef } from "./scripts/types/nav/NavigationRef";

export default function App() {
  return (
    <FirebaseAuthProvider firebase={firebase} {...firebaseConfig}>
      <NavigationContainer ref={navigationRef}>
        <AppContainer.Provider>
          <MapContainer.Provider>
            <Drawer.Navigator initialRouteName={Routes.Unauthenticated}>
              <Drawer.Screen
                name={Routes.Home}
                component={HomeScreen}
                options={{ title: Routes.Home }}
              />
              <Drawer.Screen
                name={Routes.MapView}
                component={MapViewScreen}
                options={{ title: "Map View" }}
              />
              <Drawer.Screen
                name={Routes.Settings}
                component={SettingsScreen}
                options={{ title: Routes.Settings }}
              />
              <Drawer.Screen
                name={Routes.Unauthenticated}
                component={NotLoggedInScreen}
                options={{ title: "", gestureEnabled: false }}
              />
              <Drawer.Screen
                name={Routes.Camera}
                component={CameraScreen}
                options={{ title: "", gestureEnabled: false }}
              />
            </Drawer.Navigator>
          </MapContainer.Provider>
        </AppContainer.Provider>
      </NavigationContainer>
    </FirebaseAuthProvider>
  );
}
