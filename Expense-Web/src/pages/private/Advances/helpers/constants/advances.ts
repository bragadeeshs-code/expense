export enum ADVANCES_TAB_ENUM {
  PENDING_ISSUANCE = "pending_issuance",
  ISSUED_ADVANCES = "issued_advances",
}

export const ADVANCES_TABS_LIST: TabItem<ADVANCES_TAB_ENUM>[] = [
  {
    label: "Pending Issuance",
    value: ADVANCES_TAB_ENUM.PENDING_ISSUANCE,
  },
  {
    label: "Issued Advances",
    value: ADVANCES_TAB_ENUM.ISSUED_ADVANCES,
  },
];

export const ADVANCES_QUERY_KEY = "advances-list";
export const ISSUED_ADVANCES_QUERY_KEY = "issued-advances-list";
