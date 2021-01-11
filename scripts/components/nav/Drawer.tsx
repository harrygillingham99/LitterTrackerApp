/* 
  Drawer.tsx
  This component is the base for the Drawer Navigator, with the extra type annotation for TypeScript. 
*/

import { createDrawerNavigator } from "@react-navigation/drawer";
import { DrawerScreens } from "../../types/nav/DrawerScreens";

export const Drawer = createDrawerNavigator<DrawerScreens>();