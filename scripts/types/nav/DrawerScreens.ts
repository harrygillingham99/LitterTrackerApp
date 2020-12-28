/* 
This is the way to use a strongly typed navigator with typescript, giving proper intellisense. 
This type is used as an annotation in Drawer.tsx when calling createDrawerNavigator()
*/

export type DrawerScreens = {
  Home: undefined;
  Settings: undefined;
  MapView: undefined;
  Unauthenticated: undefined;
};
