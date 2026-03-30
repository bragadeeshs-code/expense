export const TRIP_FORM_DEFAULT_VALUES = {
  project: null,
  destination: "",
  start_date: null,
  end_date: null,
  hotel_accommodation_needed: false,
  mode_of_travel: null,
  vehicle_needed: false,
  advance_needed: false,
  advance_amount: null,
};

export enum MODE_OF_TRAVEL_ENUM {
  FLIGHT = "flight",
  TRAIN = "train",
  BUS = "bus",
  OWN_VEHICLE = "own_vehicle",
}

export enum TRIP_STATUS_ENUM {
  SUBMITTED = "submitted",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export const MODE_OF_TRAVEL_OPTIONS = [
  {
    label: "Flight",
    value: MODE_OF_TRAVEL_ENUM.FLIGHT,
  },
  {
    label: "Train",
    value: MODE_OF_TRAVEL_ENUM.TRAIN,
  },
  {
    label: "Bus",
    value: MODE_OF_TRAVEL_ENUM.BUS,
  },
  {
    label: "Own vehicle",
    value: MODE_OF_TRAVEL_ENUM.OWN_VEHICLE,
  },
];

export enum TRAVEL_REQUEST_TAB_ENUM {
  MY_REQUESTS = "my_requests",
  TEAM_REQUESTS = "team_requests",
}

export const TRAVEL_REQUESTS_TABS_LIST: TabItem<TRAVEL_REQUEST_TAB_ENUM>[] = [
  {
    label: "My Requests",
    value: TRAVEL_REQUEST_TAB_ENUM.MY_REQUESTS,
  },
  {
    label: "Team Requests",
    value: TRAVEL_REQUEST_TAB_ENUM.TEAM_REQUESTS,
  },
];

export const TRIPS_QUERY_KEY = "trips-list";
export const TEAM_TRIPS_QUERY_KEY = "team-trips-list";
