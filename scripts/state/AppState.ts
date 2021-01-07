import useSetState from "react-use/lib/useSetState";
import { createContainer } from "unstated-next";
import firebase from "firebase";
import React, { useState } from "react";

interface AppState {
  user: firebase.User;
}

const useAppState = () => {
  const [appState, setAppState] = useSetState<AppState>();
  const [refresh, setRefresh] = useState<boolean>()

  const refreshPins = () => setRefresh(!refresh);

  return {
    appState,
    setAppState,
    refresh,
    refreshPins
  };
};

export const AppContainer = createContainer(useAppState);
