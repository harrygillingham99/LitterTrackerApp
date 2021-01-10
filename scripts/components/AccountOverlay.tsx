import React, { useState } from "react";
import { Overlay, Card, Button, Text } from "react-native-elements";
import { AppContainer } from "../state/AppState";
import { HomeScreenState } from "../screens/HomeScreen";
import { AppColour } from "../styles/Colours";
import { signOut } from "../services/firebase/Firebase";
import { navigate } from "../types/nav/NavigationRef";
import { Routes } from "../types/nav/Routes";
import useEffectOnce from "react-use/lib/useEffectOnce";
import { LitterTrackerAppClient, IConfig } from "../services/api/Client";
import { Loader } from "./Loader";

interface AccountOverlayProps {
  visible: boolean;
  setHomeState: (
    patch:
      | Partial<HomeScreenState>
      | ((prevState: HomeScreenState) => Partial<HomeScreenState>)
  ) => void;
}

export const AccountOverlay = (props: AccountOverlayProps) => {
  const { visible } = props;
  const { appState, setAppState } = AppContainer.useContainer();
  const [loading, setLoading] = useState<boolean>(false);

  const dismissOverlay = () => {
    props.setHomeState({ showAccountModal: false });
  };

  const onSignOutPress = async () => {
    navigate(Routes.Unauthenticated);
    await signOut();
    setAppState({ user: undefined });
    props.setHomeState({ showAccountModal: false });
  };

  useEffectOnce(() => {
    setLoading(true);
    (async () => {
      if (appState.user === undefined) return;
      const token = (await appState.user.getIdToken()) ?? "not-logged-in";
      const client = new LitterTrackerAppClient(new IConfig(token));
      const statsForUser = await client.getUserStatistics();
      setAppState({ stats: statsForUser });
    })();
    setLoading(false);
  });

  return (
    <Overlay isVisible={visible} onBackdropPress={dismissOverlay}>
      <>
        {!loading && (
          <Card
            containerStyle={{
              borderColor: "transparent",
              shadowColor: "transparent",
              backgroundColor: "transparent",
            }}
          >
            <Card.Title>{appState.user.email ?? "Anonymous user"}</Card.Title>
            <Card.Divider />
            <Text style={{ fontSize: 18, marginBottom: 5 }}>
              Pins created: {appState?.stats?.pinsCreated}
            </Text>
            <Text style={{ fontSize: 18, marginBottom: 15 }}>
              Areas cleaned: {appState?.stats?.areasCleared}
            </Text>
            <Card.Divider />
            <Button
              title={"Sign Out"}
              buttonStyle={{ backgroundColor: AppColour }}
              onPress={onSignOutPress}
            ></Button>
          </Card>
        )}
        {loading && <Loader />}
      </>
    </Overlay>
  );
};
