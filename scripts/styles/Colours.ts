import { LitterPin } from "../services/api/Client"

export const HeadingColour = '#008000'

export const getPinColour = (marker: LitterPin) => marker.imageUrls === undefined || (marker.imageUrls !== undefined && marker.imageUrls.length === 0) ? "black" : marker.areaCleaned ? "green" : "blue";