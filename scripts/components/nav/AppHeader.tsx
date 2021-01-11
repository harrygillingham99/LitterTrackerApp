/* 
  AppHeader.tsx
  This is the app's header component, with the ability to pass in 
  different components and onPress functions depending on what screen it is used in.  
*/

import * as React from "react";
import { Header, Icon } from "react-native-elements";
import { AppColour } from "../../styles/Colours";

interface AppHeaderProps {
  leftComponentOnPress?: () => void;
  centerComponent: React.ReactElement;
  showBack?: boolean;
  hideLeftComponent?: boolean;
  rightComponent?: React.ReactElement;
}

export const AppHeader = ({
  leftComponentOnPress,
  centerComponent,
  showBack = false,
  hideLeftComponent = false,
  rightComponent,
}: AppHeaderProps): JSX.Element => {
  return (
    <Header
      leftComponent={
        hideLeftComponent ? (
          <></>
        ) : (
          <Icon
            name={showBack ? "chevron-left" : "menu"}
            onPress={leftComponentOnPress}
            color={"white"}
          />
        )
      }
      rightComponent={rightComponent}
      centerComponent={centerComponent}
      backgroundColor={AppColour}
    ></Header>
  );
};
