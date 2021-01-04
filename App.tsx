import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Routes } from "./scripts/types/nav/Routes";
import { HomeScreen } from "./scripts/screens/HomeScreen";
import { Drawer } from "./scripts/components/nav/Drawer";
import { MapViewScreen } from "./scripts/screens/MapViewScreen";
import { SettingsScreen } from "./scripts/screens/SettingsScreen";
import { FirebaseAuthProvider, IfFirebaseAuthed } from "@react-firebase/auth";
import * as firebase from "firebase";
import { firebaseConfig } from "./scripts/services/firebase/Firebase";
import { NotLoggedInScreen } from "./scripts/screens/NotLoggedInScreen";
import { AppContainer } from "./scripts/state/AppState";
import { MapContainer } from "./scripts/state/MapState";

export default function App() {
  return (
    <NavigationContainer>
      <AppContainer.Provider>
        <MapContainer.Provider>
          <FirebaseAuthProvider firebase={firebase} {...firebaseConfig}>
            <Drawer.Navigator initialRouteName={Routes.Unauthenticated}>
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
              <Drawer.Screen
                name={Routes.Unauthenticated}
                component={NotLoggedInScreen}
                options={{ title: "", gestureEnabled: false }}
              />
            </Drawer.Navigator>
          </FirebaseAuthProvider>
        </MapContainer.Provider>
      </AppContainer.Provider>
    </NavigationContainer>
  );
}
