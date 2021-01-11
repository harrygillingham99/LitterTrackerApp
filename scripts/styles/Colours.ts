/* 
  Colours.ts
  A small utility file used to store and resolve colours for things.
*/

import { LitterPin } from "../services/api/Client";

export const AppColour = "#008000";

//pins with no images are black, pins that need clearing are blue and cleared pins are green
export const getPinColour = (marker: LitterPin) =>
  marker.imageUrls === undefined ||
  (marker.imageUrls !== undefined && marker.imageUrls.length === 0)
    ? "black"
    : marker.areaCleaned
    ? "green"
    : "blue";
