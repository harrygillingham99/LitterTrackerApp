import useSetState from "react-use/lib/useSetState";
import { createContainer } from "unstated-next";
import * as firebase from "firebase"

interface AppState {
  user: firebase.default.User
}

const useAppState = () => {
  const [appState, setAppState] = useSetState<AppState>();
  return { appState, setAppState };
};

export const AppContainer = createContainer(useAppState);