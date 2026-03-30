import type {
  Coordinates,
  MapplsRoute,
  LocationDetails,
  MapplsLocationData,
  MapplsDirectionResponse,
} from "../types/mappls";

export const extractCoordinates = (
  data: MapplsLocationData | null,
): Coordinates | null => {
  if (!data) return null;

  if (data.lat !== undefined && data.lng !== undefined) {
    const lat = Number(data.lat);
    const lng = Number(data.lng);
    if (!isNaN(lat) && !isNaN(lng)) {
      return { lat, lng };
    }
  }

  if (data.data) {
    const nested = data.data;
    if (nested.lat !== undefined && nested.lng !== undefined) {
      const lat = Number(nested.lat);
      const lng = Number(nested.lng);
      if (!isNaN(lat) && !isNaN(lng)) {
        return { lat, lng };
      }
    }
  }

  return null;
};

export const extractAddress = (data: MapplsLocationData | null): string => {
  if (!data) return "";

  const info = data.data || data;

  if (info.formatted_address) return info.formatted_address;
  if (info.address) return info.address;

  if (info.lat && info.lng) {
    return `Coordinates: ${Number(info.lat).toFixed(4)}, ${Number(info.lng).toFixed(4)}`;
  }

  return "";
};

export const convertToLocationDetails = (
  data: MapplsLocationData | null,
  fallbackName?: string,
): LocationDetails | null => {
  const coords = extractCoordinates(data);
  if (!coords) return null;

  const address = extractAddress(data);
  const name =
    address ||
    fallbackName ||
    `Location at ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`;

  return {
    ...coords,
    name,
  };
};

export const findShortestRoute = (
  response: MapplsDirectionResponse,
): {
  distance: string;
  distanceMeters: number;
  durationSeconds: number;
} | null => {
  let shortestDistance: string | null = null;
  let shortestDistanceMeters = Infinity;
  let durationSeconds = 0;

  const processRoutes = (routes: MapplsRoute[]): void => {
    for (const route of routes) {
      if (route.distance_mts && route.distance_mts < shortestDistanceMeters) {
        shortestDistanceMeters = route.distance_mts;
        shortestDistance = route.distance;
        durationSeconds = route.eta_sec;
      }
    }
  };

  if (
    response.data &&
    Array.isArray(response.data) &&
    response.data.length > 0
  ) {
    processRoutes(response.data);
  } else if (response.All_routes && Array.isArray(response.All_routes)) {
    const activeIdx = response.actrtnum || 0;
    const routes = response.All_routes[activeIdx];
    if (Array.isArray(routes)) {
      processRoutes(routes);
    }
  }

  if (shortestDistance && shortestDistanceMeters !== Infinity) {
    return {
      distance: shortestDistance,
      distanceMeters: shortestDistanceMeters,
      durationSeconds: durationSeconds,
    };
  }

  return null;
};

export const formatCoordinatesForAPI = (coords: Coordinates): string => {
  return `${coords.lat.toFixed(6)},${coords.lng.toFixed(6)}`;
};
