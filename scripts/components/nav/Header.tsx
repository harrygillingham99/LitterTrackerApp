import * as React from "react";
import { Header, Icon } from "react-native-elements";
import { HeadingColour } from "../../styles/Colours";

/* 
This is a custom header component used by the the screens in this application, 
it allows for custom sub components to be passed in from the parent. 
*/

interface AppHeaderProps {
  leftComponentOnPress?: () => void; //a function reference to either go back or open the drawer, depending on whats passed in
  centerComponent: React.ReactElement;
  showBack?: boolean;
  hideLeftComponent?: boolean;
  rightComponent?: React.ReactElement;
}

export const AppHeader = ({
  leftComponentOnPress,
  centerComponent,
  showBack = false, // optional, used on the detailed beach view, to be able to return to the previous easily
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
      backgroundColor={HeadingColour}
    ></Header>
  );
};
