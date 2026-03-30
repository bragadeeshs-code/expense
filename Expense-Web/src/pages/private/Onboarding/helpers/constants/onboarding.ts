import OnboardingProjects from "../../components/Projects/OnboardingProjects";
import DataSource from "../../components/ConnectedData/DataSource";
import EmployeeManagement from "../../components/EmployeeManagement/EmployeeManagement";
import OrganizationSetup from "../../components/OrganizationSetup/OrganizationSetup";
import RolesAndGrades from "../../components/RolesAndGrades/RolesAndGrades";
import type { Connection, Step } from "../../types/onboarding.types";
import { ASSET_PATH, RoleEnum } from "@/helpers/constants/common";

export enum ONBOARDING_STEP_ENUM {
  CONNECT_DATA = "connect_data",
  ROLES_GRADES = "roles_grades",
  EMPLOYEE_MANAGEMENT = "employee_management",
  PROJECTS_APPROVALS = "projects_approvals",
  ORGANIZATION_SETUP = "organization_setup",
}

export const onboardingSteps: Step[] = [
  { id: ONBOARDING_STEP_ENUM.CONNECT_DATA, label: "Connect Data" },
  { id: ONBOARDING_STEP_ENUM.ROLES_GRADES, label: "Define Roles & Grades" },

  {
    id: ONBOARDING_STEP_ENUM.EMPLOYEE_MANAGEMENT,
    label: "Employee Management",
  },
  {
    id: ONBOARDING_STEP_ENUM.PROJECTS_APPROVALS,
    label: "Projects & Approvals",
  },
  { id: ONBOARDING_STEP_ENUM.ORGANIZATION_SETUP, label: "Organization Setup" },
];

export const onboardingStepContents = [
  { step: ONBOARDING_STEP_ENUM.CONNECT_DATA, content: DataSource },
  { step: ONBOARDING_STEP_ENUM.ROLES_GRADES, content: RolesAndGrades },

  {
    step: ONBOARDING_STEP_ENUM.EMPLOYEE_MANAGEMENT,
    content: EmployeeManagement,
  },
  {
    step: ONBOARDING_STEP_ENUM.PROJECTS_APPROVALS,
    content: OnboardingProjects,
  },
  { step: ONBOARDING_STEP_ENUM.ORGANIZATION_SETUP, content: OrganizationSetup },
];

export enum ROLES_AND_GRADES {
  ROLES_AND_ACCESS = "roles_and_access",
  GRADES_AND_POLICIES = "grades_and_policies",
  COST_CENTERS = "cost_centers",
  DEPARTMENTS = "departments",
}

export enum ORGANIZATION_SETUP {
  COMPANY_ASSETS = "company_assets",
}

export const RolesAndGradesTabs: TabItem<ROLES_AND_GRADES>[] = [
  {
    label: "Roles & Access",
    value: ROLES_AND_GRADES.ROLES_AND_ACCESS,
    access: [RoleEnum.ADMIN],
  },
  {
    label: "Grades & Policies",
    value: ROLES_AND_GRADES.GRADES_AND_POLICIES,
    access: [RoleEnum.ADMIN],
  },
  {
    label: "Cost Centers",
    value: ROLES_AND_GRADES.COST_CENTERS,
    access: [RoleEnum.ADMIN],
  },
  {
    label: "Departments",
    value: ROLES_AND_GRADES.DEPARTMENTS,
    access: [RoleEnum.ADMIN],
  },
];

export const OrganizationSetupTabs: TabItem<ORGANIZATION_SETUP>[] = [
  {
    label: "Company Assets",
    value: ORGANIZATION_SETUP.COMPANY_ASSETS,
    access: [RoleEnum.ADMIN],
  },
];

export enum ConnectionProviderEnum {
  MANUAL_UPLOAD = "manual_upload",
  GOOGLE_DRIVE = "google_drive",
  ONEDRIVE = "onedrive",
  OUTLOOK = "outlook",
  GMAIL = "gmail",
  SHARE_POINT = "share_point",
  DROP_BOX = "drop_box",
  WHATSAPP = "whatsapp",
  TALLY = "tally",
  GOOGLE_MAP = "google_map",
  SAP = "sap",
  WEBHOOK = "webhook",
}

export const dataSourceIcons: Record<ConnectionProviderEnum, string> = {
  [ConnectionProviderEnum.MANUAL_UPLOAD]: `${ASSET_PATH}/icons/upload.svg`,
  [ConnectionProviderEnum.GOOGLE_DRIVE]: `${ASSET_PATH}/icons/google-drive.svg`,
  [ConnectionProviderEnum.ONEDRIVE]: `${ASSET_PATH}/icons/onedrive.svg`,
  [ConnectionProviderEnum.OUTLOOK]: `${ASSET_PATH}/icons/outlook.svg`,
  [ConnectionProviderEnum.GMAIL]: `${ASSET_PATH}/icons/gmail.svg`,
  [ConnectionProviderEnum.SHARE_POINT]: `${ASSET_PATH}/icons/sharepoint.svg`,
  [ConnectionProviderEnum.DROP_BOX]: `${ASSET_PATH}/icons/dropbox.svg`,
  [ConnectionProviderEnum.WHATSAPP]: `${ASSET_PATH}/icons/whatsapp.svg`,
  [ConnectionProviderEnum.TALLY]: `${ASSET_PATH}/icons/tally.svg`,
  [ConnectionProviderEnum.SAP]: `${ASSET_PATH}/icons/sap.svg`,
  [ConnectionProviderEnum.GOOGLE_MAP]: `${ASSET_PATH}/icons/google_map.svg`,
  [ConnectionProviderEnum.WEBHOOK]: `${ASSET_PATH}/icons/webhook.svg`,
};

export const dataSourceNames: Record<ConnectionProviderEnum, string> = {
  [ConnectionProviderEnum.MANUAL_UPLOAD]: "Manual Upload",
  [ConnectionProviderEnum.GOOGLE_DRIVE]: "Google Drive",
  [ConnectionProviderEnum.ONEDRIVE]: "OneDrive",
  [ConnectionProviderEnum.GMAIL]: "Gmail",
  [ConnectionProviderEnum.OUTLOOK]: "Outlook",
  [ConnectionProviderEnum.SHARE_POINT]: "Microsoft SharePoint",
  [ConnectionProviderEnum.DROP_BOX]: "Dropbox",
  [ConnectionProviderEnum.WHATSAPP]: "WhatsApp",
  [ConnectionProviderEnum.TALLY]: "Tally",
  [ConnectionProviderEnum.SAP]: "SAP",
  [ConnectionProviderEnum.GOOGLE_MAP]: "Google Maps API",
  [ConnectionProviderEnum.WEBHOOK]: "Webhook",
};

export const dataSources: DataSource[] = [
  {
    image: dataSourceIcons.whatsapp,
    name: dataSourceNames.whatsapp,
    type: ConnectionProviderEnum.WHATSAPP,
  },
  {
    image: dataSourceIcons.google_drive,
    name: dataSourceNames.google_drive,
    type: ConnectionProviderEnum.GOOGLE_DRIVE,
  },
  {
    image: dataSourceIcons.onedrive,
    name: dataSourceNames.onedrive,
    type: ConnectionProviderEnum.ONEDRIVE,
  },
  {
    image: dataSourceIcons.tally,
    name: dataSourceNames.tally,
    type: ConnectionProviderEnum.TALLY,
  },
  {
    image: dataSourceIcons.sap,
    name: dataSourceNames.sap,
    type: ConnectionProviderEnum.SAP,
  },
  {
    image: dataSourceIcons.share_point,
    name: dataSourceNames.share_point,
    type: ConnectionProviderEnum.SHARE_POINT,
  },
  {
    image: dataSourceIcons.drop_box,
    name: dataSourceNames.drop_box,
    type: ConnectionProviderEnum.DROP_BOX,
  },
  {
    image: dataSourceIcons.gmail,
    name: dataSourceNames.gmail,
    type: ConnectionProviderEnum.GMAIL,
  },
  {
    image: dataSourceIcons.outlook,
    name: dataSourceNames.outlook,
    type: ConnectionProviderEnum.OUTLOOK,
  },
  {
    image: dataSourceIcons.webhook,
    name: dataSourceNames.webhook,
    type: ConnectionProviderEnum.WEBHOOK,
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isConnectionResponse = (obj: any): obj is ConnectionResponse => {
  return (
    obj &&
    typeof obj === "object" &&
    "status" in obj &&
    "source_type" in obj &&
    "provider_type" in obj &&
    "email" in obj
  );
};

export const inputTypes = [
  ConnectionProviderEnum.GMAIL,
  ConnectionProviderEnum.OUTLOOK,
  ConnectionProviderEnum.SHARE_POINT,
  ConnectionProviderEnum.DROP_BOX,
  ConnectionProviderEnum.WHATSAPP,
];

export const outputTypes = [
  ConnectionProviderEnum.GOOGLE_DRIVE,
  ConnectionProviderEnum.ONEDRIVE,
  ConnectionProviderEnum.SHARE_POINT,
  ConnectionProviderEnum.DROP_BOX,
  ConnectionProviderEnum.TALLY,
  ConnectionProviderEnum.SAP,
  ConnectionProviderEnum.WEBHOOK,
];

export enum SourceEnum {
  INPUT = "input",
  OUTPUT = "output",
}

export const GOOGLE_MAP_DATA: Connection = {
  id: 1,
  status: "connected",
  source_type: SourceEnum.OUTPUT,
  provider_type: ConnectionProviderEnum.GOOGLE_MAP,
  connection_email: "Admin setup completed",
  created_at: "2025-01-07T08:15:00Z",
  updated_at: "2025-01-07T08:15:00Z",
};

export const GENERATOR_TYPE_OPTIONS = [
  {
    label: "Industrial Backup Unit",
    value: "industrial_backup_unit",
  },
];

export const FUEL_TYPE_OPTIONS = {
  generator: [
    {
      label: "Diesel",
      value: "diesel",
    },
    {
      label: "Petrol",
      value: "petrol",
    },
    {
      label: "LPG",
      value: "lpg",
    },
    {
      label: "Natural Gas",
      value: "natural_gas",
    },
    {
      label: "Bio Diesel",
      value: "bio_diesel",
    },
    {
      label: "Dual Fuel",
      value: "dual_fuel",
    },
  ],

  vehicle: [
    {
      label: "CNG",
      value: "cng",
    },
    {
      label: "Diesel",
      value: "diesel",
    },
    {
      label: "Petrol",
      value: "petrol",
    },
    {
      label: "Hydrogen",
      value: "hydrogen",
    },
    {
      label: "LPG",
      value: "lpg",
    },
    {
      label: "Electric",
      value: "electric",
    },
    {
      label: "Hybrid",
      value: "hybrid",
    },
  ],
};

export const VEHICLE_TYPE_OPTION = [
  {
    label: "Sedan",
    value: "sedan",
  },
  {
    label: "SUV",
    value: "suv",
  },
  {
    label: "VAN",
    value: "van",
  },
  {
    label: "Truck",
    value: "truck",
  },
];

export const GENERATOR_SETUP_FORM_DEFAULT_VALUES = {
  generator_id: "",
  generator_type: null,
  make_and_model: "",
  fuel_type: null,
  operational_responsibility: null,
};

export const COMPANY_VEHICLE_SETUP_FORM_DEFAULT_VALUES = {
  vehicle_number: "",
  vehicle_type: null,
  make_and_model: "",
  fuel_type: null,
  operational_responsibility: null,
};

export const COMPANY_ASSETS_MUTATION_QUERY = "company-assets";
export const CONNECTIONS_LIST_API_QUERY_KEY = "connections";

export const supportedProviders = [ConnectionProviderEnum.WEBHOOK];

export const NON_CONFIGURABLE_PROVIDERS = [ConnectionProviderEnum.WEBHOOK];

export const SUPPORTED_INTEGRATION_PROVIDERS = [
  ConnectionProviderEnum.GOOGLE_DRIVE,
  ConnectionProviderEnum.GMAIL,
  ConnectionProviderEnum.OUTLOOK,
  ConnectionProviderEnum.ONEDRIVE,
];
