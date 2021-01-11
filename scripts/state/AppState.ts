/* 
  AppState.ts
  Used to handle the global app state for the application. 
  Stores the logged in user and their pin statistics.
*/

import useSetState from "react-use/lib/useSetState";
import { createContainer } from "unstated-next";
import firebase from "firebase";
import { UserStatistics } from "../services/api/Client";
import { useState } from "react";
import { tryGetSavedCameaQuality } from "../storage/SettingsStorage";

interface AppState {
  user: firebase.User;
  stats: UserStatistics;
}

const useAppState = () => {
  const [appState, setAppState] = useSetState<AppState>();
  const [cameraQuality, setCameraQuality] = useState(0.5);

  const tryGetQualityFromStorage = () => {
    tryGetSavedCameaQuality(setCameraQuality);
  };

  return {
    appState,
    setAppState,
    cameraQuality,
    setCameraQuality,
    tryGetQualityFromStorage
  };
};

export const AppContainer = createContainer(useAppState);
