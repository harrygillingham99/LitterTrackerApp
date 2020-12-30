import { LatLng } from "../api/Client";
import Fetch from "../Fetch";
import { PostcodeForCoordinateUrl } from "./Constants";
import { ReverseLookupRequest, ReverseLookupResponse } from "./Types";

export const GetLocationInformationForCoordinate = async (
  coordinate: LatLng
) => {
  const request: ReverseLookupRequest = {
    geolocations: [
      {
        latitude: coordinate.latitude!,
        longitude: coordinate.longitude!,
        radius: 1000,
        limit: 5,
      },
    ],
  };

  const headers = new Headers();

  headers.append("Content-Type", "application/json");

  var result = await Fetch.HttpRequest<ReverseLookupResponse>(
    PostcodeForCoordinateUrl,
    "POST",
    JSON.stringify(request),
    headers
  );

  return result.result[0].result[0];
};
