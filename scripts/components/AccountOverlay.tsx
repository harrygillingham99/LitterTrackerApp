import React from "react";
import { Overlay, Card, Button } from "react-native-elements";
import { AppContainer } from "../state/AppState";
import { HomeScreenState } from "../screens/HomeScreen";
import { AppColour } from "../styles/Colours";
import { signOut } from "../services/firebase/Firebase";
import { navigate } from "../types/nav/NavigationRef";
import { Routes } from "../types/nav/Routes";

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

  const dismissOverlay = () => {
    props.setHomeState({ showAccountModal: false });
  };

  const onSignOutPress = async () => {
    navigate(Routes.Unauthenticated);
    await signOut();
    setAppState({ user: undefined });
    props.setHomeState({ showAccountModal: false });
  };

  return (
    <Overlay isVisible={visible} onBackdropPress={dismissOverlay}>
      <Card
        containerStyle={{
          borderColor: "transparent",
          shadowColor: "transparent",
          backgroundColor: "transparent",
        }}
      >
        <Card.Title>{appState.user.email ?? "Anonymous user"}</Card.Title>
        <Card.Divider />
        <Button
          title={"Sign Out"}
          buttonStyle={{ backgroundColor: AppColour }}
          onPress={onSignOutPress}
        ></Button>
      </Card>
    </Overlay>
  );
};
