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

  return {
    appState,
    setAppState,
    refresh,
    setRefresh
  };
};

export const AppContainer = createContainer(useAppState);
