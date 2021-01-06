
import { NavigationContainerRef } from '@react-navigation/native';
import * as React from 'react';
import { Routes } from './Routes';

export const navigationRef = React.createRef<NavigationContainerRef>();

export function navigate(name: Routes) {
  if (navigationRef.current) {
    // Perform navigation if the app has mounted
    navigationRef.current.navigate(name);
  } else {
    // You can decide what to do if the app hasn't mounted
    // You can ignore this, or add these actions to a queue you can call later
  }
}