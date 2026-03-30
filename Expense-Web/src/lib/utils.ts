import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { isNil, startCase } from "lodash";
import type { SortingState } from "@tanstack/react-table";
import { clsx, type ClassValue } from "clsx";
import type { StylesConfig, GroupBase } from "react-select";
import { format, isToday, isYesterday, isThisWeek } from "date-fns";
import type { AxiosError } from "axios";

import { STORAGE_KEYS } from "@/helpers/constants/storage-keys";
import { NUMBERS_ONLY_REGEX } from "@/helpers/constants/regex-patterns";
import type { SelectOption } from "@/types/common.types";
import type { SortingStateUpdater } from "@/types/common.types";
import {
  RoleEnum,
  ALLOWED_FILE_TYPES,
  TRANSACT_PROJECT_KEY,
  ACCOMMODATION_TYPE_OPTIONS,
  TRAIN_CLASS_ALLOWANCE_OPTIONS,
  FLIGHT_CLASS_ALLOWANCE_OPTIONS,
  ALLOWED_KEYS_NUMBERS_ONLY_INPUT,
  SUB_CATEGORIES_FILTER,
  VIEW_AS_USER_KEY,
} from "@/helpers/constants/common";
import type {
  CATEGORY,
  SUB_CATEGORY,
} from "@/pages/private/ExpenseView/helpers/constants/expenseView";
import type { MeResponse } from "@/types/user.types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const notifySuccess = (title: string, description: string) => {
  return toast.success(title, {
    description: description,
    descriptionClassName: "!text-ash-gray",
    position: "top-right",
  });
};

export const notifyError = (
  title: string,
  description: string | undefined,
  id?: string,
) => {
  return toast.error(title, {
    id,
    description: description ?? "Something went wrong. Please try again later",
    descriptionClassName: "!text-ash-gray",
    position: "top-right",
  });
};

export const getFileNameWithoutExtension = (fileName: string) => {
  const parts = fileName.split(".");
  parts.pop();
  return parts.join(".");
};

export const getFileExtension = (fileName: string) => {
  return fileName.split(".")?.pop()?.toLowerCase() ?? "";
};

export const validateUploadedFiles = (
  files: File[],
  existingFileNames: Set<string>,
) => {
  const invalidFiles: { name: string; reason: string }[] = [];
  const validFiles: File[] = [];

  files.forEach((file) => {
    const fileExtension = "." + getFileExtension(file.name);

    if (existingFileNames.has(file.name)) {
      invalidFiles.push({
        name: file.name,
        reason: "already uploaded",
      });
      return;
    }

    if (!ALLOWED_FILE_TYPES.includes(fileExtension)) {
      invalidFiles.push({ name: file.name, reason: "unsupported format" });
    } else {
      validFiles.push(file);
    }
  });

  return { validFiles, invalidFiles };
};

export const getFileSizeInMB = (fileSizeInBytes: number) =>
  (fileSizeInBytes / 1024 / 1024).toFixed(2);

export const getUserData = (): UserData | null => {
  const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);

  if (!userData) return null;
  const parsedUserData = JSON.parse(userData);
  return parsedUserData as UserData;
};

export const isLocalAuthDisabled = () =>
  import.meta.env.VITE_DISABLE_AUTH === "true";

export const syncLocalDevUserData = (user: MeResponse) => {
  if (!isLocalAuthDisabled()) {
    return;
  }

  const existingUserData = getUserData();
  if (existingUserData?.email === user.email) {
    return;
  }

  const nextUserData: UserData = {
    id: Number(import.meta.env.VITE_DEV_USER_ID ?? 0),
    email: user.email,
    expense: true,
    transact: false,
    expense_permissions: user.permissions ?? [],
  };

  localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(nextUserData));
};

export const isTransactProjectKeyAvailable = () => {
  const user = getUserData();
  return (user && user[TRANSACT_PROJECT_KEY]) || false;
};

export const getAuthRedirectUrl = () => {
  const currentUrl = encodeURIComponent(
    window.location.pathname + window.location.search,
  );
  return `/auth?redirect_uri=${currentUrl}`;
};

export const getPercentValue = (value: number, totalValue: number) => {
  return Math.round((value / totalValue) * 100);
};

export const getUserNameFromEmail = (email: string) =>
  startCase(email.split("@")[0]);

export const getHumanReadableDate = (
  dateString: string,
  monthFormat: MonthFormat = "long",
  showTime: boolean = false,
) => {
  const monthToken = monthFormat === "short" ? "MMM" : "MMMM";

  const dateFormat = `${monthToken} d,yyyy`;
  const timeFormat = "hh:mm a";
  return format(
    dateString,
    showTime ? `${dateFormat} ${timeFormat}` : dateFormat,
  );
};

export const formatNotificationDate = (date: string) => {
  const notificationDate = new Date(date);
  if (isToday(notificationDate)) return "Today";
  if (isYesterday(notificationDate)) return "Yesterday";
  if (isThisWeek(notificationDate, { weekStartsOn: 0 }))
    return format(notificationDate, "eeee");
  return format(notificationDate, "d MMM yyyy");
};

export const getBorderSvg = (color: string) => {
  const svg = `
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="none" stroke="${color}" rx='16' ry='16' 
        stroke-width="2" stroke-dasharray="8,8" stroke-linecap="round" />
    </svg>
  `;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
};

export const allowOnlyNumbers = (
  event: React.KeyboardEvent<HTMLInputElement>,
) => {
  const isControlA =
    (event.key === "a" || event.key === "A") &&
    (event.ctrlKey || event.metaKey); // metaKey = Cmd on mac

  if (isControlA) return; // Allow Ctrl+A / Cmd+A
  if (ALLOWED_KEYS_NUMBERS_ONLY_INPUT.includes(event.key)) return;
  if (!NUMBERS_ONLY_REGEX.test(event.key)) event.preventDefault();
};

export const formatToINR = (value: number) => {
  const decimalPart = value.toString().split(".")[1];
  const actualFractionLength = decimalPart?.length ?? 0;
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: actualFractionLength,
    maximumFractionDigits: actualFractionLength,
  }).format(value);
};

export const selectMemberStyles = <O>(): StylesConfig<
  O,
  true,
  GroupBase<O>
> => ({
  control: (base) => ({
    ...base,
    minHeight: 44,
    borderRadius: 8,
    padding: "4px",
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: "#F5F6F7B2",
    borderRadius: 999,
    padding: "4px",
    border: "1px solid #E6E7E999",
  }),
  multiValueRemove: (base) => ({
    ...base,
    cursor: "pointer",
    ":hover": {
      backgroundColor: "#e2e8f0",
    },
  }),
});

export const formatWithPlus = (value?: string) => {
  if (!value) return "";
  return value.startsWith("+") ? value : `+${value}`;
};

export const downloadFile = (url: string) => {
  window.location.assign(url);
};

export const hasAccess = (user: MeResponse, access?: RoleEnum[]) => {
  if (!access) {
    return true;
  }
  return access.includes(user.viewRole);
};

export const getConfidenceColor = (value: number) => {
  if (value > 75) {
    return "bg-mint-frost text-forest-fern";
  }
  if (value > 50) {
    return "bg-light-golden-yellow text-dark-mustard-yellow";
  }
  return "bg-soft-rose-mist text-tomato-red";
};

export const getConfidenceTextColor = (value: number | undefined): string => {
  if (isNil(value)) return "";
  if (value > 75) return "text-mint-green";
  if (value > 25) return "text-golden-yellow";
  return "text-soft-rose-mist";
};

export const pickTrainClass = (trainClass?: string) =>
  TRAIN_CLASS_ALLOWANCE_OPTIONS.find((option) => option.value === trainClass);

export const pickFlightClass = (flightClass?: string) =>
  FLIGHT_CLASS_ALLOWANCE_OPTIONS.find((option) => option.value === flightClass);

export const pickAccommodationType = (accommodationType?: string) =>
  ACCOMMODATION_TYPE_OPTIONS.find(
    (option) => option.value === accommodationType,
  );

export const getSortingState = (
  sorting: SortingState,
  updater: SortingStateUpdater,
) => (typeof updater === "function" ? updater(sorting) : updater);

export const formatApiError = (error: AxiosError<APIErrorResponse> | null) => {
  const detail = error?.response?.data.detail;

  if (Array.isArray(detail) && detail.length) {
    return detail
      .map((error) => `${startCase(error.field)}: ${error.message}`)
      .join(" | ");
  }

  if (typeof detail === "string") return detail;

  return error?.message ?? "Unexpected error occurred";
};

export const getSubCategories = (
  category: CATEGORY,
): SelectOption<SUB_CATEGORY>[] => {
  return SUB_CATEGORIES_FILTER[category] ?? [];
};

export const formatCompactDate = (value: number) => {
  const date = new Date(value);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

export const getViewRole = (user: MeResponse): RoleEnum => {
  const viewAsUser = localStorage.getItem(VIEW_AS_USER_KEY) == "true";
  if (user.role === RoleEnum.ADMIN && viewAsUser) {
    return RoleEnum.MANAGER;
  }
  return user.role;
};
