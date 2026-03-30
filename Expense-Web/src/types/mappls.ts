export interface Coordinates {
  lat: number;
  lng: number;
}

export interface MapplsMapEvent {
  lngLat?: Coordinates;
  latLng?: Coordinates;
}

export interface MapplsLocationData {
  lat?: number | string;
  lng?: number | string;
  data?: {
    lat?: number | string;
    lng?: number | string;
    formatted_address?: string;
    address?: string;
  };
  address?: string;
  formatted_address?: string;
}

export interface MapplsRoute {
  eta: string;
  eta_sec: number;
  distance: string;
  routeName?: string;
  distance_mts: number;
}

export interface MapplsDirectionResponse {
  data?: MapplsRoute[];
  fail?: boolean;
  error?: string;
  actrtnum?: number;
  All_routes?: MapplsRoute[][];
}

export interface MapplsDirectionInstance extends MapplsDirectionResponse {
  remove: () => void;
}

export interface MapplsMapOptions {
  zoom: number;
  center: Coordinates | [number, number];
}

export interface MapplsMap {
  on: (event: string, callback: (e: MapplsMapEvent) => void) => void;
}

export interface MapplsPlacePickerOptions {
  map: MapplsMap;
  header?: boolean;
  search?: boolean;
  closeBtn?: boolean;
  geolocation?: boolean;
}

export interface MapplsPlacePicker {
  remove?: () => void;
  getLocation: () => MapplsLocationData;
  setLocation: (coords: Coordinates) => void;
}

export interface MapplsDirectionOptions {
  map: MapplsMap;
  end: string;
  start: string;
  rtype: number;
  profile?: string;
  resource?: string;
  fitBounds?: boolean;
  alternatives?: boolean;
  callback: (res: MapplsDirectionInstance) => void;
}

export interface MapplsSDK {
  Map: new (id: string, options: MapplsMapOptions) => MapplsMap;
  advancePlacePicker: (
    options: MapplsPlacePickerOptions,
    callback: (picker: MapplsPlacePicker) => void,
  ) => void;
  direction: (options: MapplsDirectionOptions) => MapplsDirectionInstance;
}

declare global {
  interface Window {
    mappls: MapplsSDK;
  }
}

export interface LocationDetails {
  lat: number;
  lng: number;
  name: string;
}

export interface LocationInputProps {
  label: string;
  value: string;
  error?: string;
  placeholder: string;
  onClick: () => void;
}

export interface MapModalProps {
  onClose: () => void;
  onChoose: (location: LocationDetails) => void;
}
