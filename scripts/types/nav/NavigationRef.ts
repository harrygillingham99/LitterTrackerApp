/* 
  NavigationRef.ts
  A useful utility reference to the app's NavigationContainer to allow 
  for easy navigaiton in components where there is no access to a navigation prop.
*/

import { NavigationContainerRef } from '@react-navigation/native';
import * as React from 'react';
import { Routes } from './Routes';

export const navigationRef = React.createRef<NavigationContainerRef>();

export function navigate(name: Routes) {
  if (navigationRef.current) {
    // Perform navigation if the app has mounted
    navigationRef.current.navigate(name);
  } else {
    console.log("Used navigation ref before app mounted!")
  }
}